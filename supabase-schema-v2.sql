-- New Supabase schema for better estimate data structure
-- Version 2.0 - Unified workflow architecture

-- Drop existing workflow_screens table (backing up data first if needed)
-- DROP TABLE IF EXISTS workflow_screens;

-- Create new estimates table with better structure
CREATE TABLE IF NOT EXISTS estimates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Structured estimate data stored as JSONB
  data JSONB NOT NULL DEFAULT '{
    "projectNotes": "",
    "lastUpdated": "",
    "workflows": {
      "demolition": {
        "design": {
          "choices": {},
          "debrisDisposal": "no",
          "pricingMode": "hourly"
        },
        "workflow": {
          "labor": {"hourlyItems": [], "flatFeeItems": []},
          "materials": {"items": []},
          "notes": {"contractorNotes": "", "clientNotes": ""},
          "estimate": {"laborTotal": 0, "materialsTotal": 0, "grandTotal": 0, "lastUpdated": ""}
        }
      },
      "showerWalls": {
        "design": {
          "walls": [],
          "design": {
            "tileSize": "",
            "waterproofingSystem": "",
            "niche": false,
            "repairWalls": false,
            "reinsulateWalls": false
          }
        },
        "workflow": {
          "labor": {"hourlyItems": [], "flatFeeItems": []},
          "materials": {"items": []},
          "notes": {"contractorNotes": "", "clientNotes": ""},
          "estimate": {"laborTotal": 0, "materialsTotal": 0, "grandTotal": 0, "lastUpdated": ""}
        }
      },
      "showerBase": {
        "design": {
          "measurements": {"width": 0, "length": 0},
          "design": {"baseType": "", "entryType": "", "clientSuppliesBase": "no"},
          "construction": {"waterproofingType": "", "repairSubfloor": false, "modifyJoists": false}
        },
        "workflow": {
          "labor": {"hourlyItems": [], "flatFeeItems": []},
          "materials": {"items": []},
          "notes": {"contractorNotes": "", "clientNotes": ""},
          "estimate": {"laborTotal": 0, "materialsTotal": 0, "grandTotal": 0, "lastUpdated": ""}
        }
      },
      "floors": {
        "design": {
          "measurements": {"width": 0, "length": 0, "extraMeasurements": []},
          "design": {"tilePattern": "", "notes": ""},
          "construction": {"selectedPrepTasks": [], "plywoodThickness": "", "constructionNotes": ""}
        },
        "workflow": {
          "labor": {"hourlyItems": [], "flatFeeItems": []},
          "materials": {"items": []},
          "notes": {"contractorNotes": "", "clientNotes": ""},
          "estimate": {"laborTotal": 0, "materialsTotal": 0, "grandTotal": 0, "lastUpdated": ""}
        }
      },
      "finishings": {
        "design": {
          "designChoices": {"selectedFinishes": [], "paintColors": [], "fixtures": []},
          "finishingsScope": {"selectedScopes": [], "customScope": ""},
          "accentWalls": {"hasAccentWall": false, "paintType": "", "wallLocations": []}
        },
        "workflow": {
          "labor": {"hourlyItems": [], "flatFeeItems": []},
          "materials": {"items": []},
          "notes": {"contractorNotes": "", "clientNotes": ""},
          "estimate": {"laborTotal": 0, "materialsTotal": 0, "grandTotal": 0, "lastUpdated": ""}
        }
      },
      "structural": {
        "design": {
          "choices": {"electrical": [], "plumbing": [], "ventilation": [], "structural": []}
        },
        "workflow": {
          "labor": {"hourlyItems": [], "flatFeeItems": []},
          "materials": {"items": []},
          "notes": {"contractorNotes": "", "clientNotes": ""},
          "estimate": {"laborTotal": 0, "materialsTotal": 0, "grandTotal": 0, "lastUpdated": ""}
        }
      },
      "trades": {
        "design": {
          "choices": {"electrical": [], "plumbing": [], "hvac": [], "flooring": [], "tile": [], "paint": []}
        },
        "workflow": {
          "labor": {"hourlyItems": [], "flatFeeItems": []},
          "materials": {"items": []},
          "notes": {"contractorNotes": "", "clientNotes": ""},
          "estimate": {"laborTotal": 0, "materialsTotal": 0, "grandTotal": 0, "lastUpdated": ""}
        }
      }
    },
    "estimate": {
      "totalLabor": 0,
      "totalMaterials": 0,
      "grandTotal": 0,
      "breakdown": []
    }
  }',
  
  -- Metadata
  version VARCHAR(10) DEFAULT '2.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_estimates_project_id ON estimates(project_id);
CREATE INDEX IF NOT EXISTS idx_estimates_updated_at ON estimates(updated_at);

-- Create GIN index for JSONB data queries
CREATE INDEX IF NOT EXISTS idx_estimates_data_gin ON estimates USING GIN(data);

-- Enable Row Level Security
ALTER TABLE estimates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own estimates"
  ON estimates FOR SELECT
  USING (project_id IN (
    SELECT id FROM projects 
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own estimates"
  ON estimates FOR INSERT
  WITH CHECK (project_id IN (
    SELECT id FROM projects 
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own estimates"
  ON estimates FOR UPDATE
  USING (project_id IN (
    SELECT id FROM projects 
    WHERE user_id = auth.uid()
  ))
  WITH CHECK (project_id IN (
    SELECT id FROM projects 
    WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own estimates"
  ON estimates FOR DELETE
  USING (project_id IN (
    SELECT id FROM projects 
    WHERE user_id = auth.uid()
  ));

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_estimates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_estimates_updated_at ON estimates;
CREATE TRIGGER trigger_estimates_updated_at
  BEFORE UPDATE ON estimates
  FOR EACH ROW
  EXECUTE FUNCTION update_estimates_updated_at();

-- Migration function to convert old workflow_screens data to new estimates format
CREATE OR REPLACE FUNCTION migrate_workflow_screens_to_estimates()
RETURNS VOID AS $$
DECLARE
  old_record RECORD;
  new_data JSONB;
BEGIN
  -- Loop through all existing workflow_screens records
  FOR old_record IN 
    SELECT DISTINCT project_id, data 
    FROM workflow_screens 
    WHERE screen_type = 'demolition'
  LOOP
    -- Create new estimate record with migrated data
    new_data := jsonb_build_object(
      'projectNotes', COALESCE(old_record.data->>'projectNotes', ''),
      'lastUpdated', NOW()::text,
      'workflows', jsonb_build_object(
        'demolition', jsonb_build_object(
          'design', jsonb_build_object(
            'choices', COALESCE(old_record.data->'demolitionChoices', '{}'),
            'debrisDisposal', COALESCE(old_record.data->>'debrisDisposal', 'no'),
            'pricingMode', CASE 
              WHEN old_record.data->>'isDemolitionFlatFee' = 'yes' THEN 'flatFee'
              ELSE 'hourly'
            END,
            'flatFee', CASE 
              WHEN old_record.data->>'isDemolitionFlatFee' = 'yes' THEN
                jsonb_build_object(
                  'amount', COALESCE(old_record.data->>'flatFeeAmount', '0'),
                  'description', COALESCE(old_record.data->>'flatFeeDescription', 'Demolition & Debris Removal')
                )
              ELSE NULL
            END
          ),
          'workflow', jsonb_build_object(
            'labor', jsonb_build_object(
              'hourlyItems', COALESCE(old_record.data->'categoryWorkflowData'->'demolition'->'labor'->'laborItems', '[]'),
              'flatFeeItems', COALESCE(old_record.data->'categoryWorkflowData'->'demolition'->'labor'->'flatFeeItems', '[]')
            ),
            'materials', jsonb_build_object(
              'items', COALESCE(old_record.data->'categoryWorkflowData'->'demolition'->'materials'->'constructionMaterials', '[]')
            ),
            'notes', jsonb_build_object(
              'contractorNotes', COALESCE(old_record.data->>'demolitionContractorNotes', ''),
              'clientNotes', COALESCE(old_record.data->>'demolitionClientNotes', '')
            ),
            'estimate', jsonb_build_object(
              'laborTotal', 0,
              'materialsTotal', 0,
              'grandTotal', 0,
              'lastUpdated', NOW()::text
            )
          )
        ),
        -- Add other workflows with empty default structure
        'showerWalls', jsonb_build_object(
          'design', COALESCE(old_record.data->'showerWalls', '{"walls": [], "design": {"tileSize": "", "waterproofingSystem": "", "niche": false, "repairWalls": false, "reinsulateWalls": false}}'),
          'workflow', '{"labor": {"hourlyItems": [], "flatFeeItems": []}, "materials": {"items": []}, "notes": {"contractorNotes": "", "clientNotes": ""}, "estimate": {"laborTotal": 0, "materialsTotal": 0, "grandTotal": 0, "lastUpdated": ""}}'::jsonb
        ),
        'showerBase', jsonb_build_object(
          'design', COALESCE(old_record.data->'showerBase', '{"measurements": {"width": 0, "length": 0}, "design": {"baseType": "", "entryType": "", "clientSuppliesBase": "no"}, "construction": {"waterproofingType": "", "repairSubfloor": false, "modifyJoists": false}}'),
          'workflow', '{"labor": {"hourlyItems": [], "flatFeeItems": []}, "materials": {"items": []}, "notes": {"contractorNotes": "", "clientNotes": ""}, "estimate": {"laborTotal": 0, "materialsTotal": 0, "grandTotal": 0, "lastUpdated": ""}}'::jsonb
        ),
        'floors', jsonb_build_object(
          'design', COALESCE(old_record.data->'floorData', '{"measurements": {"width": 0, "length": 0, "extraMeasurements": []}, "design": {"tilePattern": "", "notes": ""}, "construction": {"selectedPrepTasks": [], "plywoodThickness": "", "constructionNotes": ""}}'),
          'workflow', '{"labor": {"hourlyItems": [], "flatFeeItems": []}, "materials": {"items": []}, "notes": {"contractorNotes": "", "clientNotes": ""}, "estimate": {"laborTotal": 0, "materialsTotal": 0, "grandTotal": 0, "lastUpdated": ""}}'::jsonb
        ),
        'finishings', '{"design": {"designChoices": {"selectedFinishes": [], "paintColors": [], "fixtures": []}, "finishingsScope": {"selectedScopes": [], "customScope": ""}, "accentWalls": {"hasAccentWall": false, "paintType": "", "wallLocations": []}}, "workflow": {"labor": {"hourlyItems": [], "flatFeeItems": []}, "materials": {"items": []}, "notes": {"contractorNotes": "", "clientNotes": ""}, "estimate": {"laborTotal": 0, "materialsTotal": 0, "grandTotal": 0, "lastUpdated": ""}}}'::jsonb,
        'structural', '{"design": {"choices": {"electrical": [], "plumbing": [], "ventilation": [], "structural": []}}, "workflow": {"labor": {"hourlyItems": [], "flatFeeItems": []}, "materials": {"items": []}, "notes": {"contractorNotes": "", "clientNotes": ""}, "estimate": {"laborTotal": 0, "materialsTotal": 0, "grandTotal": 0, "lastUpdated": ""}}}'::jsonb,
        'trades', '{"design": {"choices": {"electrical": [], "plumbing": [], "hvac": [], "flooring": [], "tile": [], "paint": []}}, "workflow": {"labor": {"hourlyItems": [], "flatFeeItems": []}, "materials": {"items": []}, "notes": {"contractorNotes": "", "clientNotes": ""}, "estimate": {"laborTotal": 0, "materialsTotal": 0, "grandTotal": 0, "lastUpdated": ""}}}'::jsonb
      ),
      'estimate', jsonb_build_object(
        'totalLabor', 0,
        'totalMaterials', 0,
        'grandTotal', 0,
        'breakdown', '[]'::jsonb
      )
    );

    -- Insert the migrated record
    INSERT INTO estimates (project_id, data, version)
    VALUES (old_record.project_id, new_data, '2.0')
    ON CONFLICT (project_id) DO UPDATE SET
      data = EXCLUDED.data,
      version = EXCLUDED.version,
      updated_at = NOW();
      
  END LOOP;
  
  RAISE NOTICE 'Migration completed. Migrated % records.', 
    (SELECT COUNT(DISTINCT project_id) FROM workflow_screens WHERE screen_type = 'demolition');
END;
$$ LANGUAGE plpgsql;

-- Add unique constraint to ensure one estimate per project
ALTER TABLE estimates 
ADD CONSTRAINT unique_project_estimate 
UNIQUE (project_id);

-- Add comments for documentation
COMMENT ON TABLE estimates IS 'Stores bathroom renovation estimates with unified workflow data structure v2.0';
COMMENT ON COLUMN estimates.data IS 'JSONB containing all workflow data, design choices, labor, materials, and calculations';
COMMENT ON COLUMN estimates.version IS 'Data structure version for migration compatibility';

-- Create helper functions for querying workflow data
CREATE OR REPLACE FUNCTION get_workflow_labor_total(estimate_data JSONB, workflow_name TEXT)
RETURNS NUMERIC AS $$
BEGIN
  RETURN COALESCE(
    (estimate_data->'workflows'->workflow_name->'workflow'->'estimate'->>'laborTotal')::NUMERIC,
    0
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION get_workflow_materials_total(estimate_data JSONB, workflow_name TEXT)
RETURNS NUMERIC AS $$
BEGIN
  RETURN COALESCE(
    (estimate_data->'workflows'->workflow_name->'workflow'->'estimate'->>'materialsTotal')::NUMERIC,
    0
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION get_estimate_grand_total(estimate_data JSONB)
RETURNS NUMERIC AS $$
BEGIN
  RETURN COALESCE(
    (estimate_data->'estimate'->>'grandTotal')::NUMERIC,
    0
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Example queries for the new structure:
-- Get all estimates with totals:
-- SELECT 
--   e.id,
--   e.project_id,
--   p.project_name,
--   get_estimate_grand_total(e.data) as total,
--   e.updated_at
-- FROM estimates e
-- JOIN projects p ON e.project_id = p.id;

-- Get demolition labor items for a project:
-- SELECT 
--   data->'workflows'->'demolition'->'workflow'->'labor'->'hourlyItems' as labor_items
-- FROM estimates 
-- WHERE project_id = 'your-project-id';

-- Get workflow breakdown for a project:
-- SELECT 
--   'demolition' as workflow,
--   get_workflow_labor_total(data, 'demolition') as labor_total,
--   get_workflow_materials_total(data, 'demolition') as materials_total
-- FROM estimates 
-- WHERE project_id = 'your-project-id';
