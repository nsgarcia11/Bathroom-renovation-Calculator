import React, { useState, useEffect, useMemo } from 'react';

import {
  UserCircle,
  Home,
  Users,
  Archive,
  BarChart2,
  ArrowLeft,
  ChevronsRight,
  Hammer,
  Bath,
  Paintbrush,
  ShowerHead,
  ClipboardList,
  HardHat,
  FileText,
  Camera,
  Settings,
  Trash2,
  Layers,
  Plus,
  Pencil,
  X,
  Mail,
  ChevronDown,
  Wrench,
  MoreHorizontal,
  Sparkles,
  Zap,
  Droplets,
  Briefcase,
  Clock,
  Building,
  DollarSign,
  Image as ImageIcon,
  Percent,
  Info,
  Award,
} from 'lucide-react';

// --- Constants ---
const PROVINCES = {
  AB: { name: 'Alberta', taxRate: 5 },
  BC: { name: 'British Columbia', taxRate: 12 },
  MB: { name: 'Manitoba', taxRate: 12 },
  NB: { name: 'New Brunswick', taxRate: 15 },
  NL: { name: 'Newfoundland and Labrador', taxRate: 15 },
  NS: { name: 'Nova Scotia', taxRate: 15 },
  NT: { name: 'Northwest Territories', taxRate: 5 },
  NU: { name: 'Nunavut', taxRate: 5 },
  ON: { name: 'Ontario', taxRate: 13 },
  PE: { name: 'Prince Edward Island', taxRate: 15 },
  QC: { name: 'Quebec', taxRate: 14.975 },
  SK: { name: 'Saskatchewan', taxRate: 11 },
  YT: { name: 'Yukon', taxRate: 5 },
};

const DEMOLITION_TASKS = [
  { id: 'remove_vanity', label: 'Remove Vanity & Mirror', price: 120 },
  { id: 'remove_toilet', label: 'Remove Toilet', price: 80 },
  {
    id: 'remove_flooring',
    label: 'Remove Flooring (up to 50 sqft)',
    price: 200,
  },
  {
    id: 'remove_shower_walls',
    label: 'Remove Shower/Tub Surround Walls',
    price: 350,
  },
  { id: 'remove_tub', label: 'Remove Bathtub/Shower Base', price: 250 },
  {
    id: 'remove_drywall',
    label: 'Remove Drywall (up to 100 sqft)',
    price: 400,
  },
  { id: 'dump_run', label: 'Waste Disposal & Dump Run', price: 300 },
];

// --- Helper Components ---

const CheckboxInput = ({ id, label, price, checked, onChange }) => (
  <label
    htmlFor={id}
    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
      checked
        ? 'bg-blue-50 border-blue-600 shadow-md'
        : 'border-slate-300 hover:border-slate-400'
    }`}
  >
    <div>
      <span className='font-medium text-slate-800 text-sm'>{label}</span>
    </div>
    <div className='flex items-center'>
      {price > 0 && (
        <span className='text-slate-600 mr-3 text-sm font-semibold'>
          ${price.toFixed(2)}
        </span>
      )}
      <input
        type='checkbox'
        id={id}
        checked={checked}
        onChange={onChange}
        className='form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500'
      />
    </div>
  </label>
);

const TextInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  readOnly = false,
}) => (
  <div>
    <label
      htmlFor={id}
      className='block text-sm font-medium text-slate-600 mb-1'
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className='block w-full p-2 border border-slate-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400'
    />
  </div>
);

const TextareaInput = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  helperText,
}) => (
  <div>
    <label
      htmlFor={id}
      className='block text-sm font-medium text-slate-600 mb-1'
    >
      {label}
    </label>
    <textarea
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className='block w-full p-2 border border-slate-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 placeholder-slate-400'
      rows='4'
    ></textarea>
    {helperText && <p className='mt-2 text-xs text-slate-500'>{helperText}</p>}
  </div>
);

const SelectInput = ({ id, label, value, onChange, children }) => (
  <div>
    <label
      htmlFor={id}
      className='block text-sm font-medium text-slate-600 mb-1'
    >
      {label}
    </label>
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className='block w-full p-2 border border-slate-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500'
    >
      {children}
    </select>
  </div>
);

const CategoryRow = ({ title, icon, onClick, cost }) => (
  <button
    onClick={onClick}
    className='w-full flex items-center p-4 bg-white hover:bg-slate-50 border-b border-slate-200 transition-colors duration-200 last:border-b-0'
  >
    <div className='p-2 bg-slate-100 rounded-lg'>{icon}</div>
    <span className='font-semibold text-sm text-slate-700 ml-4'>{title}</span>
    <div className='ml-auto flex items-center space-x-3'>
      {cost !== undefined && (
        <span className='font-bold text-slate-800 text-sm'>
          ${cost.toFixed(2)}
        </span>
      )}
      <ChevronsRight className='text-slate-400 w-5 h-5' />
    </div>
  </button>
);

const GridItem = ({ icon, title, onClick, isActive, cost }) => (
  <button
    onClick={onClick}
    className={`relative flex flex-col items-center justify-center aspect-square rounded-xl transition-all border p-2 shadow-sm hover:shadow-md 
    ${
      isActive
        ? 'bg-blue-600 text-white border-blue-600'
        : 'bg-white text-slate-500 hover:bg-blue-50 hover:border-blue-500 hover:text-blue-600 border-slate-200'
    }`}
  >
    {React.cloneElement(icon, { className: 'w-8 h-8 mb-1.5' })}
    <span className='text-sm text-center font-medium'>{title}</span>
    {cost > 0 && (
      <div
        className={`absolute top-1 right-1 text-xs font-bold px-1.5 py-0.5 rounded-full ${
          isActive ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-700'
        }`}
      >
        ${cost.toFixed(0)}
      </div>
    )}
  </button>
);

const DetailPage = ({ title, setActiveScreen, children }) => (
  <div className='bg-white h-full'>
    <div className='p-4 border-b border-slate-200 flex items-center space-x-4 sticky top-0 bg-white z-10'>
      <button
        onClick={() => setActiveScreen('main')}
        className='text-slate-500 hover:text-slate-900'
      >
        <ArrowLeft size={22} />
      </button>
      <h2 className='text-xl font-bold text-slate-800'>{title}</h2>
    </div>
    <div className='p-6 text-slate-500 bg-slate-50/50'>
      {children ? children : `Content for ${title} will go here.`}
    </div>
  </div>
);

const TradeDetailPage = ({
  title,
  options,
  onOptionChange,
  setActiveScreen,
  totalCost,
}) => (
  <div className='bg-white h-full'>
    <div className='p-4 border-b border-slate-200 flex items-center space-x-4 sticky top-0 bg-white z-10'>
      <button
        onClick={() => setActiveScreen('main')}
        className='text-slate-500 hover:text-slate-900'
      >
        <ArrowLeft size={22} />
      </button>
      <h2 className='text-xl font-bold text-slate-800'>{title}</h2>
    </div>
    <div className='p-4 space-y-3 pb-24'>
      {Object.entries(options).map(([key, { label, price, selected }]) => (
        <CheckboxInput
          key={key}
          id={key}
          label={label}
          price={price}
          checked={selected}
          onChange={() => onOptionChange(key, !selected)}
        />
      ))}
    </div>
    <div className='absolute bottom-0 left-0 right-0 p-4 border-t bg-white/80 backdrop-blur-sm'>
      <div className='flex justify-between items-center text-lg font-bold text-slate-900'>
        <span>{title} Total</span>
        <span>${totalCost.toFixed(2)}</span>
      </div>
    </div>
  </div>
);

const EmailPage = ({ estimate, onCancel }) => {
  const [subject, setSubject] = useState(
    `Estimate for ${estimate.customerInfo.name}`
  );
  const [body, setBody] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const totalCost =
      (estimate.totalElectricalCost || 0) +
      (estimate.totalPlumbingCost || 0) +
      (estimate.totalDemolitionCost || 0);
    const summary = `
Hello ${estimate.customerInfo.name},

Here is the summary of your bathroom renovation estimate:

Demolition: $${(estimate.totalDemolitionCost || 0).toFixed(2)}
Electrical: $${(estimate.totalElectricalCost || 0).toFixed(2)}
Plumbing: $${(estimate.totalPlumbingCost || 0).toFixed(2)}
... more items to come ...

Total Estimated Cost: $${totalCost.toFixed(2)}

Thank you,
Your Friendly Contractor
        `;
    setBody(summary.trim());
  }, [estimate]);

  const handleSend = () => {
    setStatus('Email sent successfully!');
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div className='p-4 space-y-4 bg-white h-full'>
      <div className='p-4 border-b border-slate-200 flex items-center space-x-4 sticky top-0 bg-white z-10 -m-4 mb-4'>
        <button
          onClick={onCancel}
          className='text-slate-500 hover:text-slate-900'
        >
          <ArrowLeft size={22} />
        </button>
        <h2 className='text-xl font-bold text-slate-800'>Send Estimate</h2>
      </div>
      {status && (
        <div className='p-3 bg-green-100 text-green-800 rounded-md'>
          {status}
        </div>
      )}
      <div className='space-y-4'>
        <TextInput
          id='to'
          label='To'
          value={estimate.customerInfo.emails?.[0] || ''}
          readOnly={true}
        />
        <TextInput
          id='subject'
          label='Subject'
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <div>
          <label
            htmlFor='body'
            className='block text-sm font-medium text-slate-600 mb-1'
          >
            Body
          </label>
          <textarea
            id='body'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className='w-full h-64 p-2 border border-slate-300 rounded-md text-sm'
          />
        </div>
      </div>
      <div className='flex justify-end space-x-3 pt-4'>
        <button
          onClick={onCancel}
          className='px-4 py-2 rounded-md text-slate-600 bg-slate-200 hover:bg-slate-300'
        >
          Cancel
        </button>
        <button
          onClick={handleSend}
          className='px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700'
        >
          Send Email
        </button>
      </div>
    </div>
  );
};

// --- Page Components ---

const EstimateDetail = ({
  estimate,
  onUpdate,
  onBack,
  onEditCustomer,
  setCurrentPage,
}) => {
  const [activeScreen, setActiveScreen] = useState('main');
  const [lastActiveScreen, setLastActiveScreen] = useState(null); // State to remember the last clicked item
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [editedCustomerInfo, setEditedCustomerInfo] = useState(
    estimate.customerInfo
  );
  const [isProjectManagementCollapsed, setIsProjectManagementCollapsed] =
    useState(false);

  useEffect(() => {
    setEditedCustomerInfo(estimate.customerInfo);
  }, [estimate]);

  const handleGridItemClick = (screen) => {
    setActiveScreen(screen);
    setLastActiveScreen(screen);
  };

  const handleCustomerEdit = () => {
    setIsEditingCustomer(true);
  };

  const handleCustomerSave = () => {
    onUpdate(estimate.id, { customerInfo: editedCustomerInfo });
    setIsEditingCustomer(false);
  };

  const handleCustomerCancel = () => {
    setEditedCustomerInfo(estimate.customerInfo);
    setIsEditingCustomer(false);
  };

  const handleCustomerInfoChange = (e) => {
    const { name, value } = e.target;
    setEditedCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleTradeOptionChange = (tradeType, key, value) => {
    const updatedOptions = {
      ...estimate[tradeType],
      [key]: { ...estimate[tradeType][key], selected: value },
    };
    const newTotal = Object.values(updatedOptions).reduce(
      (sum, opt) => sum + (opt.selected ? opt.price : 0),
      0
    );

    const costField =
      tradeType === 'electricalOptions'
        ? 'totalElectricalCost'
        : 'totalPlumbingCost';

    onUpdate(estimate.id, {
      [tradeType]: updatedOptions,
      [costField]: newTotal,
    });
  };

  const electricalCost = useMemo(
    () => estimate.totalElectricalCost || 0,
    [estimate.totalElectricalCost]
  );
  const plumbingCost = useMemo(
    () => estimate.totalPlumbingCost || 0,
    [estimate.totalPlumbingCost]
  );
  const demolitionCost = useMemo(
    () => estimate.totalDemolitionCost || 0,
    [estimate.totalDemolitionCost]
  );

  const costItems = [
    {
      title: 'Demolition',
      icon: <Hammer />,
      screen: 'demolition',
      cost: demolitionCost,
    },
    {
      title: 'Shower Walls',
      icon: <ShowerHead />,
      screen: 'showerWalls',
      cost: 0,
    },
    {
      title: 'Shower Base',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <rect width='18' height='18' x='3' y='3' rx='2' />
          <circle cx='12' cy='12' r='1' />
        </svg>
      ),
      screen: 'showerBase',
      cost: 0,
    },
    {
      title: 'Bathroom Floor',
      icon: <Layers />,
      screen: 'bathroomFloor',
      cost: 0,
    },
    {
      title: 'Finishings',
      icon: <Paintbrush />,
      screen: 'finishings',
      cost: 0,
    },
    {
      title: 'Trades',
      icon: <HardHat />,
      screen: 'trades',
      cost: electricalCost + plumbingCost,
    },
    {
      title: 'Structural',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z' />
          <path d='M9 12h6' />
        </svg>
      ),
      screen: 'structuralOther',
      cost: 0,
    },
  ];

  const projectManagerItems = [
    {
      title: 'Pictures',
      icon: <Camera className='w-5 h-5 text-gray-500' />,
      screen: 'pictures',
    },
    {
      title: 'View Summary',
      icon: <FileText className='w-5 h-5 text-gray-500' />,
      screen: 'summary',
    },
    {
      title: 'Notes',
      icon: <ClipboardList className='w-5 h-5 text-gray-500' />,
      screen: 'notes',
    },
    {
      title: 'Send Estimate',
      icon: <Mail className='w-5 h-5 text-gray-500' />,
      screen: 'email',
    },
    {
      title: 'Project Settings',
      icon: <Settings className='w-5 h-5 text-gray-500' />,
      screen: 'settings',
    },
  ];

  const mainContent = (
    <div className='bg-slate-100 p-4 space-y-4'>
      <button
        onClick={onBack}
        className='flex items-center text-sm text-blue-600 font-semibold'
      >
        <ArrowLeft size={18} className='mr-1' />
        Back to Projects
      </button>
      <div className='bg-white rounded-xl shadow-sm p-4'>
        {isEditingCustomer ? (
          <div className='space-y-3'>
            <TextInput
              id='name'
              name='name'
              label='Full Name'
              value={editedCustomerInfo.name}
              onChange={handleCustomerInfoChange}
            />
            <TextInput
              id='address'
              name='address'
              label='Property Address'
              value={editedCustomerInfo.address}
              onChange={handleCustomerInfoChange}
            />
            <TextInput
              id='email'
              name='email'
              label='Email Address'
              value={editedCustomerInfo.emails[0]}
              onChange={(e) =>
                setEditedCustomerInfo({
                  ...editedCustomerInfo,
                  emails: [e.target.value],
                })
              }
            />
            <TextInput
              id='phone'
              name='phone'
              label='Phone Number'
              value={editedCustomerInfo.phones[0]}
              onChange={(e) =>
                setEditedCustomerInfo({
                  ...editedCustomerInfo,
                  phones: [e.target.value],
                })
              }
            />
            <div className='flex justify-end space-x-2 pt-2'>
              <button
                onClick={handleCustomerCancel}
                className='px-3 py-1 text-sm rounded-md bg-slate-200 hover:bg-slate-300'
              >
                Cancel
              </button>
              <button
                onClick={handleCustomerSave}
                className='px-3 py-1 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700'
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className='flex justify-between items-start'>
            <div>
              <h2 className='text-lg font-bold text-slate-800'>
                {estimate.projectName}
              </h2>
              <p className='text-sm text-slate-500'>
                {estimate.customerInfo.name}
              </p>
            </div>
            <button
              onClick={handleCustomerEdit}
              className='text-sm text-blue-600 font-semibold'
            >
              Edit
            </button>
          </div>
        )}
      </div>

      <div className='grid grid-cols-2 gap-4'>
        {costItems.map((item) => (
          <GridItem
            key={item.title}
            title={item.title}
            icon={item.icon}
            onClick={() => handleGridItemClick(item.screen)}
            isActive={
              activeScreen === 'main' && lastActiveScreen === item.screen
            }
            cost={item.cost}
          />
        ))}
      </div>

      <div className='bg-white rounded-xl shadow-sm mt-4'>
        <button
          onClick={() =>
            setIsProjectManagementCollapsed(!isProjectManagementCollapsed)
          }
          className='w-full flex justify-between items-center p-4 bg-slate-50 rounded-t-xl border-b'
        >
          <div className='flex items-center space-x-3'>
            <Briefcase className='w-5 h-5 text-slate-600' />
            <h3 className='text-base font-bold text-slate-800'>
              Project Management
            </h3>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${
              isProjectManagementCollapsed ? '' : 'rotate-180'
            }`}
          />
        </button>
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${
            isProjectManagementCollapsed ? 'max-h-0' : 'max-h-[300px]'
          }`}
        >
          {projectManagerItems.map((item) => (
            <CategoryRow
              key={item.title}
              title={item.title}
              icon={item.icon}
              onClick={() => handleGridItemClick(item.screen)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const TradesListPage = () => (
    <DetailPage title='Trades' setActiveScreen={setActiveScreen}>
      <div className='space-y-3 -mx-2'>
        <CategoryRow
          title='Electrical'
          icon={<Zap className='w-5 h-5 text-yellow-500' />}
          onClick={() => handleGridItemClick('electrical')}
          cost={electricalCost}
        />
        <CategoryRow
          title='Plumbing'
          icon={<Droplets className='w-5 h-5 text-blue-500' />}
          onClick={() => handleGridItemClick('plumbing')}
          cost={plumbingCost}
        />
      </div>
    </DetailPage>
  );

  const DemolitionPage = () => {
    const demolitionData = estimate.demolition || { selectedTasks: [] };
    const selectedTasks = demolitionData.selectedTasks || [];

    const handleTaskChange = (taskId, isSelected) => {
      const newSelectedTasks = isSelected
        ? [...selectedTasks, taskId]
        : selectedTasks.filter((id) => id !== taskId);

      const newTotalCost = DEMOLITION_TASKS.reduce((total, task) => {
        return newSelectedTasks.includes(task.id) ? total + task.price : total;
      }, 0);

      onUpdate(estimate.id, {
        demolition: { ...demolitionData, selectedTasks: newSelectedTasks },
        totalDemolitionCost: newTotalCost,
      });
    };

    return (
      <div className='bg-white h-full'>
        <div className='p-4 border-b border-slate-200 flex items-center space-x-4 sticky top-0 bg-white z-10'>
          <button
            onClick={() => setActiveScreen('main')}
            className='text-slate-500 hover:text-slate-900'
          >
            <ArrowLeft size={22} />
          </button>
          <h2 className='text-xl font-bold text-slate-800'>Demolition</h2>
        </div>
        <div className='p-4 space-y-3 pb-24'>
          {DEMOLITION_TASKS.map((task) => (
            <CheckboxInput
              key={task.id}
              id={task.id}
              label={task.label}
              price={task.price}
              checked={selectedTasks.includes(task.id)}
              onChange={(e) => handleTaskChange(task.id, e.target.checked)}
            />
          ))}
        </div>
        <div className='absolute bottom-0 left-0 right-0 p-4 border-t bg-white/80 backdrop-blur-sm'>
          <div className='flex justify-between items-center text-lg font-bold text-slate-900'>
            <span>Demolition Total</span>
            <span>${demolitionCost.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  };

  const BathroomFloorPage = ({
    estimate,
    onUpdate,
    setActiveScreen: setEstimateScreen,
  }) => {
    const [floorData, setFloorData] = useState(estimate.bathroomFloor || {});

    useEffect(() => {
      setFloorData(estimate.bathroomFloor || {});
    }, [estimate.bathroomFloor]);

    const handleUpdate = (newData) => {
      const updatedFloorData = { ...floorData, ...newData };
      setFloorData(updatedFloorData);
      onUpdate(estimate.id, { bathroomFloor: updatedFloorData });
    };

    const handleDimensionChange = (e) => {
      const { name, value } = e.target;
      handleUpdate({
        dimensions: { ...(floorData.dimensions || {}), [name]: value },
      });
    };

    const handlePrepTaskChange = (task) => {
      const currentTasks = floorData.selectedPrepTasks || [];
      const newTasks = currentTasks.includes(task)
        ? currentTasks.filter((t) => t !== task)
        : [...currentTasks, task];
      handleUpdate({ selectedPrepTasks: newTasks });
    };

    const PREP_TASKS = [
      { id: 'remove_floor', label: 'Remove existing floor', price: 250 },
      { id: 'install_subfloor', label: 'Install new subfloor', price: 400 },
      {
        id: 'leveling_compound',
        label: 'Leveling compound application',
        price: 300,
      },
      { id: 'waterproofing', label: 'Waterproofing membrane', price: 350 },
    ];

    return (
      <DetailPage title='Bathroom Floor' setActiveScreen={setEstimateScreen}>
        <div className='space-y-6'>
          <div className='p-4 bg-white rounded-lg shadow-sm border border-slate-200'>
            <h3 className='font-semibold text-md text-slate-800 border-b pb-2 mb-4'>
              Floor Dimensions
            </h3>
            <div className='grid grid-cols-2 gap-4'>
              <TextInput
                id='length'
                name='length'
                label='Length (ft)'
                value={floorData.dimensions?.length || ''}
                onChange={handleDimensionChange}
                placeholder='e.g., 8'
                type='number'
              />
              <TextInput
                id='width'
                name='width'
                label='Width (ft)'
                value={floorData.dimensions?.width || ''}
                onChange={handleDimensionChange}
                placeholder='e.g., 5'
                type='number'
              />
            </div>
          </div>
          <div className='p-4 bg-white rounded-lg shadow-sm border border-slate-200'>
            <h3 className='font-semibold text-md text-slate-800 border-b pb-2 mb-4'>
              Tile Selection
            </h3>
            <div className='space-y-3'>
              <CheckboxInput
                id='clientSuppliesTiles'
                label='Client is supplying tiles'
                price={0}
                checked={floorData.clientSuppliesTiles || false}
                onChange={() =>
                  handleUpdate({
                    clientSuppliesTiles: !floorData.clientSuppliesTiles,
                  })
                }
              />
              {!floorData.clientSuppliesTiles && (
                <div className='pt-2'>
                  <TextInput
                    id='tileSelection'
                    name='tileSelection'
                    label='Tile Selection / SKU'
                    value={floorData.tileSelection || ''}
                    onChange={(e) =>
                      handleUpdate({ tileSelection: e.target.value })
                    }
                    placeholder='Enter tile name or SKU'
                  />
                </div>
              )}
            </div>
          </div>
          <div className='p-4 bg-white rounded-lg shadow-sm border border-slate-200'>
            <h3 className='font-semibold text-md text-slate-800 border-b pb-2 mb-4'>
              Floor Preparation
            </h3>
            <div className='space-y-3'>
              {PREP_TASKS.map((task) => (
                <CheckboxInput
                  key={task.id}
                  id={task.id}
                  label={task.label}
                  price={task.price}
                  checked={(floorData.selectedPrepTasks || []).includes(
                    task.id
                  )}
                  onChange={() => handlePrepTaskChange(task.id)}
                />
              ))}
            </div>
          </div>
          <div className='p-4 bg-white rounded-lg shadow-sm border border-slate-200'>
            <h3 className='font-semibold text-md text-slate-800 border-b pb-2 mb-4'>
              Notes
            </h3>
            <textarea
              value={floorData.notes || ''}
              onChange={(e) => handleUpdate({ notes: e.target.value })}
              className='w-full h-24 p-2 border border-slate-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500'
              placeholder='Add any notes about the bathroom floor...'
            />
          </div>
        </div>
      </DetailPage>
    );
  };

  const renderContent = () => {
    switch (activeScreen) {
      case 'main':
        return mainContent;
      case 'trades':
        return <TradesListPage />;
      case 'demolition':
        return <DemolitionPage />;
      case 'electrical':
        return (
          <TradeDetailPage
            title='Electrical'
            options={estimate.electricalOptions}
            onOptionChange={(key, value) =>
              handleTradeOptionChange('electricalOptions', key, value)
            }
            setActiveScreen={setActiveScreen}
            totalCost={electricalCost}
          />
        );
      case 'plumbing':
        return (
          <TradeDetailPage
            title='Plumbing'
            options={estimate.plumbingOptions}
            onOptionChange={(key, value) =>
              handleTradeOptionChange('plumbingOptions', key, value)
            }
            setActiveScreen={setActiveScreen}
            totalCost={plumbingCost}
          />
        );
      case 'showerBase':
        return (
          <DetailPage title='Shower Base' setActiveScreen={setActiveScreen} />
        );
      case 'showerWalls':
        return (
          <DetailPage title='Shower Walls' setActiveScreen={setActiveScreen} />
        );
      case 'bathroomFloor':
        return (
          <BathroomFloorPage
            estimate={estimate}
            onUpdate={onUpdate}
            setActiveScreen={setActiveScreen}
          />
        );
      case 'finishings':
        return (
          <DetailPage title='Finishings' setActiveScreen={setActiveScreen} />
        );
      case 'structuralOther':
        return (
          <DetailPage
            title='Structural and Other'
            setActiveScreen={setActiveScreen}
          />
        );
      case 'notes':
        return (
          <DetailPage title='Notes' setActiveScreen={setActiveScreen}>
            <textarea
              value={estimate.notes || ''}
              onChange={(e) => onUpdate(estimate.id, { notes: e.target.value })}
              className='w-full h-64 p-2 border border-slate-300 rounded-md text-sm'
              placeholder='Enter project notes here...'
            />
          </DetailPage>
        );
      case 'email':
        return (
          <EmailPage
            estimate={estimate}
            onCancel={() => setActiveScreen('main')}
          />
        );
      case 'pictures':
        return (
          <PlaceholderPage
            title='Pictures'
            onBack={() => setActiveScreen('main')}
          />
        );
      case 'summary':
        return (
          <PlaceholderPage
            title='Summary'
            onBack={() => setActiveScreen('main')}
          />
        );
      case 'settings':
        return (
          <PlaceholderPage
            title='Project Settings'
            onBack={() => setActiveScreen('main')}
          />
        );
      default:
        return mainContent;
    }
  };

  return (
    <div className='h-full overflow-y-auto bg-slate-100'>{renderContent()}</div>
  );
};

const NewProjectForm = ({ onSave, onCancel }) => {
  const [projectData, setProjectData] = useState({
    projectName: '',
    customerName: '',
    address: '',
    emails: [''],
    phones: [''],
    notes: '',
  });

  const handleFieldChange = (field, value) => {
    setProjectData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    const newArr = [...projectData[field]];
    newArr[index] = value;
    setProjectData((prev) => ({ ...prev, [field]: newArr }));
  };

  const addArrayField = (field) => {
    setProjectData((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayField = (field, index) => {
    if (projectData[field].length <= 1) return;
    const newArr = [...projectData[field]];
    newArr.splice(index, 1);
    setProjectData((prev) => ({ ...prev, [field]: newArr }));
  };

  const handleSave = () => {
    if (projectData.projectName.trim() && projectData.customerName.trim()) {
      onSave(projectData);
    }
  };

  return (
    <div className='bg-white h-full'>
      <div className='p-4 border-b border-slate-200 flex items-center space-x-4 sticky top-0 bg-white z-10'>
        <h2 className='text-xl font-bold text-slate-800'>Create New Project</h2>
      </div>
      <div className='p-6 bg-slate-50/50 space-y-6'>
        <div className='p-4 bg-white rounded-lg shadow-sm border border-slate-200'>
          <h3 className='font-semibold text-md text-slate-800 border-b pb-2 mb-4'>
            Project Details
          </h3>
          <div className='space-y-4'>
            <TextInput
              id='projectName'
              name='projectName'
              label='Project Name'
              value={projectData.projectName}
              onChange={(e) => handleFieldChange('projectName', e.target.value)}
              placeholder='e.g., Main Floor Bathroom Reno'
            />
            <TextareaInput
              id='notes'
              name='notes'
              label='Internal Notes'
              value={projectData.notes}
              onChange={(e) => handleFieldChange('notes', e.target.value)}
              placeholder='Add any private notes for this project...'
              helperText='Notes are for you only and will not be displayed on the estimate.'
            />
          </div>
        </div>

        <div className='p-4 bg-white rounded-lg shadow-sm border border-slate-200'>
          <h3 className='font-semibold text-md text-slate-800 border-b pb-2 mb-4'>
            Customer Information
          </h3>
          <div className='space-y-4'>
            <TextInput
              id='customerName'
              name='customerName'
              label='Full Name'
              value={projectData.customerName}
              onChange={(e) =>
                handleFieldChange('customerName', e.target.value)
              }
              placeholder='e.g., John Doe'
            />
            <TextInput
              id='address'
              name='address'
              label='Property Address'
              value={projectData.address}
              onChange={(e) => handleFieldChange('address', e.target.value)}
              placeholder='e.g., 123 Main St, Anytown'
            />

            <div>
              <label className='block text-sm font-medium text-slate-600 mb-1'>
                Emails
              </label>
              {projectData.emails.map((email, index) => (
                <div key={index} className='flex items-center space-x-2 mb-2'>
                  <input
                    type='email'
                    value={email}
                    onChange={(e) =>
                      handleArrayChange('emails', index, e.target.value)
                    }
                    className='flex-grow p-2 border border-slate-300 rounded-md shadow-sm text-sm'
                    placeholder={`Email ${index + 1}`}
                  />
                  {projectData.emails.length > 1 && (
                    <button
                      onClick={() => removeArrayField('emails', index)}
                      className='text-red-500'
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayField('emails')}
                className='text-sm text-blue-600 flex items-center'
              >
                <Plus size={16} className='mr-1' />
                Add Email
              </button>
            </div>

            <div>
              <label className='block text-sm font-medium text-slate-600 mb-1'>
                Phone Numbers
              </label>
              {projectData.phones.map((phone, index) => (
                <div key={index} className='flex items-center space-x-2 mb-2'>
                  <input
                    type='tel'
                    value={phone}
                    onChange={(e) =>
                      handleArrayChange('phones', index, e.target.value)
                    }
                    className='flex-grow p-2 border border-slate-300 rounded-md shadow-sm text-sm'
                    placeholder={`Phone ${index + 1}`}
                  />
                  {projectData.phones.length > 1 && (
                    <button
                      onClick={() => removeArrayField('phones', index)}
                      className='text-red-500'
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayField('phones')}
                className='text-sm text-blue-600 flex items-center'
              >
                <Plus size={16} className='mr-1' />
                Add Phone
              </button>
            </div>
          </div>
        </div>

        <div className='flex justify-end space-x-3 pt-4'>
          <button
            onClick={onCancel}
            className='px-4 py-2 rounded-md text-slate-600 bg-slate-200 hover:bg-slate-300'
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className='px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700'
          >
            Save Project
          </button>
        </div>
      </div>
    </div>
  );
};

const PlaceholderPage = ({ title, onBack }) => (
  <div className='bg-white h-full'>
    <div className='p-4 border-b border-slate-200 flex items-center space-x-4 sticky top-0 bg-white z-10'>
      {onBack && (
        <button
          onClick={onBack}
          className='text-slate-500 hover:text-slate-900'
        >
          <ArrowLeft size={22} />
        </button>
      )}
      <h2 className='text-xl font-bold text-slate-800'>{title}</h2>
    </div>
    <div className='p-6 bg-slate-50 h-full flex flex-col items-center justify-center text-center'>
      <p className='text-slate-500 mt-2'>This section is under construction.</p>
    </div>
  </div>
);

const DashboardCard = ({ icon, title, value, color }) => (
  <div className='bg-white p-4 rounded-xl shadow-sm flex-1'>
    <div className={`p-2 inline-block rounded-full ${color}`}>{icon}</div>
    <p className='text-sm text-slate-500 mt-2'>{title}</p>
    <p className='text-2xl font-bold text-slate-800'>{value}</p>
  </div>
);

const SetupPage = ({ initialSettings, onSave, onBack }) => {
  const [settings, setSettings] = useState(initialSettings);
  const [status, setStatus] = useState('');

  useEffect(() => {
    setSettings(initialSettings);
  }, [initialSettings]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    const taxRate = PROVINCES[provinceCode]?.taxRate || 0;
    setSettings((prev) => ({
      ...prev,
      province: provinceCode,
      taxRate: taxRate.toString(),
    }));
  };

  const handleCurrencyChange = (currency) => {
    setSettings((prev) => ({ ...prev, currency }));
  };

  const handleSave = () => {
    onSave(settings);
    setStatus('Settings saved successfully!');
    setTimeout(() => setStatus(''), 3000);
  };

  return (
    <div className='bg-white h-full'>
      <div className='p-4 border-b border-slate-200 flex items-center space-x-4 sticky top-0 bg-white z-10'>
        <button
          onClick={onBack}
          className='text-slate-500 hover:text-slate-900'
        >
          <ArrowLeft size={22} />
        </button>
        <h2 className='text-xl font-bold text-slate-800'>Setup</h2>
      </div>
      <div className='p-6 bg-slate-50/50 space-y-6'>
        {status && (
          <div className='p-3 bg-green-100 text-green-800 rounded-md'>
            {status}
          </div>
        )}

        <div className='p-4 bg-white rounded-lg shadow-sm border border-slate-200'>
          <h3 className='font-semibold text-md text-slate-800 border-b pb-2 mb-4'>
            Company Info
          </h3>
          <div className='space-y-4'>
            <TextInput
              id='companyName'
              name='companyName'
              label='Company Name'
              value={settings.companyName || ''}
              onChange={handleChange}
            />
            <TextInput
              id='companyEmail'
              name='companyEmail'
              label='Company Email'
              value={settings.companyEmail || ''}
              onChange={handleChange}
              placeholder='contact@company.com'
              type='email'
            />
            <TextInput
              id='companyPhone'
              name='companyPhone'
              label='Company Phone #'
              value={settings.companyPhone || ''}
              onChange={handleChange}
              placeholder='(555) 123-4567'
              type='tel'
            />
            <TextInput
              id='address'
              name='address'
              label='Your Company Address'
              value={settings.address || ''}
              onChange={handleChange}
              placeholder='123 Your Street, Your City'
            />
            <TextInput
              id='postalCode'
              name='postalCode'
              label='Postal Code'
              value={settings.postalCode || ''}
              onChange={handleChange}
              placeholder='A1B 2C3'
            />
          </div>
        </div>
        <div className='p-4 bg-white rounded-lg shadow-sm border border-slate-200'>
          <h3 className='font-semibold text-md text-slate-800 mb-4'>
            Pricing & Taxes
          </h3>
          <div className='space-y-4'>
            <TextInput
              id='hourlyRate'
              name='hourlyRate'
              label='Default Hourly Rate'
              value={settings.hourlyRate || ''}
              onChange={handleChange}
              placeholder='e.g., 75'
              type='number'
            />
            <div className='grid grid-cols-2 gap-4'>
              <SelectInput
                id='province'
                name='province'
                label='Province'
                value={settings.province || ''}
                onChange={handleProvinceChange}
              >
                <option value=''>Select Province</option>
                {Object.entries(PROVINCES).map(([code, { name }]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </SelectInput>
              <TextInput
                id='taxRate'
                name='taxRate'
                label='Tax Rate (%)'
                value={settings.taxRate || ''}
                onChange={handleChange}
                type='number'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-slate-600 mb-2'>
                Currency
              </label>
              <div className='flex rounded-md shadow-sm'>
                <button
                  onClick={() => handleCurrencyChange('CAD')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md w-full border ${
                    settings.currency === 'CAD'
                      ? 'bg-blue-600 text-white z-10 border-blue-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  CAD
                </button>
                <button
                  onClick={() => handleCurrencyChange('USD')}
                  className={`-ml-px px-4 py-2 text-sm font-medium rounded-r-md w-full border ${
                    settings.currency === 'USD'
                      ? 'bg-blue-600 text-white z-10 border-blue-600'
                      : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  USD
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='pt-4'>
          <button
            onClick={handleSave}
            className='w-full px-4 py-2.5 rounded-md text-white bg-blue-600 hover:bg-blue-700 font-semibold'
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

const HomeScreen = ({ estimates, onSelect, onNew, onEdit, onDelete }) => {
  const totalEstimateValue = useMemo(() => {
    return estimates.reduce((total, est) => {
      const electrical = est.totalElectricalCost || 0;
      const plumbing = est.totalPlumbingCost || 0;
      const demolition = est.totalDemolitionCost || 0;
      return total + electrical + plumbing + demolition;
    }, 0);
  }, [estimates]);

  return (
    <div className='p-4 space-y-6 bg-slate-50 h-full'>
      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl font-bold text-slate-800'>Overview</h2>
        </div>
        <div className='flex space-x-4'>
          <DashboardCard
            icon={<Briefcase className='w-5 h-5 text-blue-500' />}
            title='Active Projects'
            value={estimates.length}
            color='bg-blue-100'
          />
          <DashboardCard
            icon={<BarChart2 className='w-5 h-5 text-green-500' />}
            title='Total Value'
            value={`$${totalEstimateValue.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            color='bg-green-100'
          />
        </div>
      </div>

      <div className='space-y-4'>
        <div className='flex justify-between items-center'>
          <h2 className='text-2xl font-bold text-slate-800'>Projects</h2>
          <button
            onClick={onNew}
            className='flex items-center space-x-2 text-sm bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
          >
            <Plus size={18} />
            <span>Add Project</span>
          </button>
        </div>
        {estimates.length === 0 ? (
          <div className='text-center py-10 px-4 bg-white rounded-lg shadow-sm'>
            <Users className='mx-auto text-slate-400 w-12 h-12' />
            <h3 className='text-lg font-semibold text-slate-700 mt-4'>
              No Projects Yet
            </h3>
            <p className='text-slate-500 text-sm mt-1'>
              Tap the 'Add Project' button to create your first estimate.
            </p>
          </div>
        ) : (
          <div className='space-y-3'>
            {estimates.map((estimate) => (
              <div
                key={estimate.id}
                className='bg-white rounded-lg shadow-sm flex items-center transition-all hover:shadow-md'
              >
                <button
                  onClick={() => onSelect(estimate)}
                  className='flex-grow p-4 text-left'
                >
                  <h3 className='font-bold text-slate-800'>
                    {estimate.projectName || 'Untitled Project'}
                  </h3>
                  <p className='text-sm text-slate-500'>
                    {estimate.customerInfo?.name || 'No customer name'}
                  </p>
                </button>
                <button
                  onClick={() => onEdit(estimate)}
                  className='p-4 text-slate-500 hover:text-blue-700'
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => onDelete(estimate.id)}
                  className='p-4 text-slate-500 hover:text-red-700'
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Setup Wizard Components ---
const SetupWizard = ({ onFinish }) => {
  const [step, setStep] = useState(1);
  const [settings, setSettings] = useState({
    companyName: '',
    companyEmail: '',
    companyPhone: '',
    address: '',
    postalCode: '',
    province: 'ON',
    hourlyRate: '75',
    taxRate: '13',
    currency: 'CAD',
  });

  useEffect(() => {
    // Set initial tax rate based on default province
    setSettings((prev) => ({
      ...prev,
      taxRate: PROVINCES[prev.province].taxRate.toString(),
    }));
  }, []);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    const taxRate = PROVINCES[provinceCode]?.taxRate || 0;
    setSettings((prev) => ({
      ...prev,
      province: provinceCode,
      taxRate: taxRate.toString(),
    }));
  };

  const handleCurrencyChange = (currency) => {
    setSettings((prev) => ({ ...prev, currency }));
  };

  const isStep1Valid =
    settings.companyName.trim() !== '' &&
    settings.companyEmail.trim() !== '' &&
    settings.companyPhone.trim() !== '' &&
    settings.address.trim() !== '' &&
    settings.postalCode.trim() !== '';

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className='text-center'>
            <Wrench className='w-16 h-16 mx-auto text-blue-500 mb-4' />
            <h1 className='text-2xl font-bold text-slate-800'>
              Welcome to the Calculator
            </h1>

            <div className='relative bg-white border-l-4 border-blue-500 shadow-md rounded-lg p-5 my-6 text-left'>
              <div className='absolute -top-4 -right-4 bg-blue-600 p-2 rounded-full shadow-lg'>
                <Award className='w-6 h-6 text-white' />
              </div>
              <p className='text-slate-700 text-sm leading-relaxed'>
                Built from nearly{' '}
                <span className='font-bold text-slate-800'>15 years</span> of{' '}
                <span className='font-bold text-slate-800'>award-winning</span>{' '}
                custom renovation experience, this calculator is designed to be
                intuitive and powerful. While the default prices are based on
                industry research, every labor and material field is{' '}
                <span className='font-bold text-blue-600'>fully editable</span>{' '}
                to match your business needs.
              </p>
            </div>

            <div className='p-4 bg-white rounded-lg shadow-sm border border-slate-200 text-left'>
              <div className='flex items-center space-x-3 border-b pb-2 mb-4'>
                <Info className='w-5 h-5 text-blue-500' />
                <h3 className='font-semibold text-md text-slate-800'>
                  Quick Guide
                </h3>
              </div>
              <ul className='space-y-2 text-sm text-slate-600'>
                <li className='flex items-start'>
                  <span className='font-bold text-slate-700 mr-2 mt-1'>
                    &#8226;
                  </span>
                  <span>
                    Fields for{' '}
                    <span className='font-semibold'>labor and materials</span>{' '}
                    are editable. You can name items and change hours or prices
                    easily and quickly.
                  </span>
                </li>
                <li className='flex items-center'>
                  <span className='w-3 h-3 bg-blue-500 rounded-full mr-2 inline-block flex-shrink-0'></span>
                  <span>
                    <span className='font-semibold'>Blue items</span> are
                    interactive. Tap them to take an action or edit details.
                  </span>
                </li>
                <li className='flex items-center'>
                  <span className='w-3 h-3 bg-orange-400 rounded-full mr-2 inline-block flex-shrink-0'></span>
                  <span>
                    <span className='font-semibold'>Orange indicators</span> are
                    warnings or require your attention.
                  </span>
                </li>
                <li className='flex items-center'>
                  <span className='w-3 h-3 bg-slate-400 rounded-full mr-2 inline-block flex-shrink-0'></span>
                  <span>
                    <span className='font-semibold'>Grey indicators</span> are
                    for your information.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <div className='text-center mb-8'>
              <Building className='w-12 h-12 mx-auto text-blue-500 mb-4' />
              <h2 className='text-xl font-bold text-slate-800'>
                Tell us about your business
              </h2>
            </div>
            <div className='space-y-4'>
              <TextInput
                id='companyName'
                name='companyName'
                label='Company Name'
                value={settings.companyName}
                onChange={handleChange}
                placeholder='e.g., Acme Renovations'
              />
              <TextInput
                id='companyEmail'
                name='companyEmail'
                label='Company Email'
                value={settings.companyEmail}
                onChange={handleChange}
                placeholder='contact@company.com'
                type='email'
              />
              <TextInput
                id='companyPhone'
                name='companyPhone'
                label='Company Phone #'
                value={settings.companyPhone}
                onChange={handleChange}
                placeholder='(555) 123-4567'
                type='tel'
              />
              <TextInput
                id='address'
                name='address'
                label='Company Address'
                value={settings.address}
                onChange={handleChange}
                placeholder='123 Your Street, Your City'
              />
              <TextInput
                id='postalCode'
                name='postalCode'
                label='Postal Code'
                value={settings.postalCode}
                onChange={handleChange}
                placeholder='A1B 2C3'
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <div className='text-center mb-8'>
              <Percent className='w-12 h-12 mx-auto text-blue-500 mb-4' />
              <h2 className='text-xl font-bold text-slate-800'>
                Set your financials & taxes
              </h2>
            </div>
            <div className='space-y-6'>
              <TextInput
                id='hourlyRate'
                name='hourlyRate'
                label='Default Hourly Rate'
                value={settings.hourlyRate}
                onChange={handleChange}
                placeholder='e.g., 75'
                type='number'
              />
              <div className='grid grid-cols-2 gap-4'>
                <SelectInput
                  id='province'
                  name='province'
                  label='Province'
                  value={settings.province}
                  onChange={handleProvinceChange}
                >
                  {Object.entries(PROVINCES).map(([code, { name }]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </SelectInput>
                <TextInput
                  id='taxRate'
                  name='taxRate'
                  label='Tax Rate (%)'
                  value={settings.taxRate}
                  onChange={handleChange}
                  type='number'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-slate-600 mb-2'>
                  Currency
                </label>
                <div className='flex rounded-md shadow-sm'>
                  <button
                    onClick={() => handleCurrencyChange('CAD')}
                    className={`px-4 py-2 text-sm font-medium rounded-l-md w-full border ${
                      settings.currency === 'CAD'
                        ? 'bg-blue-600 text-white z-10 border-blue-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    CAD
                  </button>
                  <button
                    onClick={() => handleCurrencyChange('USD')}
                    className={`-ml-px px-4 py-2 text-sm font-medium rounded-r-md w-full border ${
                      settings.currency === 'USD'
                        ? 'bg-blue-600 text-white z-10 border-blue-600'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    USD
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className='h-full bg-slate-50 flex flex-col justify-between p-8'>
      <div className='flex-grow flex items-center'>{renderStep()}</div>
      <div className='flex-shrink-0'>
        {step > 1 && (
          <div className='flex items-center justify-between'>
            <button
              onClick={prevStep}
              className='px-6 py-2.5 rounded-md text-slate-600 bg-slate-200 hover:bg-slate-300 font-semibold'
            >
              Back
            </button>
            {step < 3 ? (
              <button
                onClick={nextStep}
                disabled={step === 2 && !isStep1Valid}
                className='px-6 py-2.5 rounded-md text-white bg-blue-600 hover:bg-blue-700 font-semibold disabled:bg-slate-400'
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => onFinish(settings)}
                className='px-6 py-2.5 rounded-md text-white bg-blue-600 hover:bg-blue-700 font-semibold'
              >
                Finish Setup
              </button>
            )}
          </div>
        )}
        {step === 1 && (
          <button
            onClick={nextStep}
            className='w-full px-6 py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 font-semibold'
          >
            Get Started
          </button>
        )}
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function App() {
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [estimates, setEstimates] = useState([]);
  const [userSettings, setUserSettings] = useState(null);
  const [selectedEstimate, setSelectedEstimate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list', 'detail', 'newProject'
  const [formMode, setFormMode] = useState('new'); // 'new', 'edit'
  const [currentPage, setCurrentPage] = useState('home'); // 'home', 'setup'
  const [isSetupComplete, setIsSetupComplete] = useState(null); // null: checking, false: not complete, true: complete

  // --- Firebase Initialization ---
  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const authInstance = getAuth(app);
      setDb(firestore);
      setAuth(authInstance);
    } catch (e) {
      console.error('Firebase init failed', e);
    }
  }, []);

  // --- Auth State Change ---
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        const token =
          typeof __initial_auth_token !== 'undefined'
            ? __initial_auth_token
            : null;
        try {
          if (token) {
            await signInWithCustomToken(auth, token);
          } else {
            await signInAnonymously(auth);
          }
        } catch (error) {
          console.error('Authentication failed:', error);
        }
      }
    });
    return () => unsubscribe();
  }, [auth]);

  // --- Data Fetching & Setup Check ---
  useEffect(() => {
    if (db && userId) {
      // Check if setup is complete
      const settingsDocRef = doc(
        db,
        'artifacts',
        appId,
        'users',
        userId,
        'settings',
        'userSettings'
      );
      getDoc(settingsDocRef).then((docSnap) => {
        // Forcing setup screen to show on start as requested
        setIsSetupComplete(false);
      });

      // Fetch Estimates
      const estimatesCol = collection(
        db,
        'artifacts',
        appId,
        'users',
        userId,
        'estimates'
      );
      const unsubscribeEstimates = onSnapshot(estimatesCol, (snapshot) => {
        const estimatesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEstimates(estimatesData);
        setLoading(false); // Set loading to false after first fetch
      });

      return () => {
        unsubscribeEstimates();
      };
    }
  }, [db, userId]);

  // Keep selectedEstimate in sync with the main estimates list
  useEffect(() => {
    if (selectedEstimate) {
      const updatedEstimate = estimates.find(
        (e) => e.id === selectedEstimate.id
      );
      if (updatedEstimate) {
        setSelectedEstimate(updatedEstimate);
      } else {
        // The estimate was deleted, go back to list
        setSelectedEstimate(null);
        setView('list');
      }
    }
  }, [estimates, selectedEstimate?.id]);

  const handleSaveNewProject = async (projectData) => {
    if (!db || !userId) return;

    const { projectName, customerName, notes, ...customerDetails } =
      projectData;

    const customerInfo = {
      name: customerName,
      address: customerDetails.address,
      emails: customerDetails.emails.filter((e) => e.trim() !== ''),
      phones: customerDetails.phones.filter((p) => p.trim() !== ''),
    };

    const newEstimateData = {
      projectName,
      createdAt: serverTimestamp(),
      customerInfo,
      notes,
      demolition: {
        selectedTasks: [],
        notes: '',
      },
      showerArea: {
        baseType: '',
        wallMaterial: '',
        wallDimensions: { width: 5, height: 8 },
      },
      bathroomFloor: {
        dimensions: { width: '', length: '' },
        tileSelection: '',
        notes: '',
        clientSuppliesTiles: false,
        selectedPrepTasks: [],
      },
      electricalOptions: {
        potLights: { label: 'Pot Lights (x4)', price: 600, selected: false },
        vanityLight: {
          label: 'Vanity Light Install',
          price: 150,
          selected: false,
        },
        exhaustFan: {
          label: 'Exhaust Fan w/ Venting',
          price: 450,
          selected: false,
        },
        gfci: { label: 'New GFCI Outlet', price: 120, selected: false },
      },
      plumbingOptions: {
        roughIn: { label: 'Shower Rough-in', price: 800, selected: false },
        faucetInstall: { label: 'Faucet Install', price: 200, selected: false },
        drainInstall: { label: 'Drain Install', price: 250, selected: false },
        toiletInstall: { label: 'Toilet Install', price: 180, selected: false },
      },
      totalDemolitionCost: 0,
      totalElectricalCost: 0,
      totalPlumbingCost: 0,
    };
    const estimatesCol = collection(
      db,
      'artifacts',
      appId,
      'users',
      userId,
      'estimates'
    );
    const docRef = await addDoc(estimatesCol, newEstimateData);
    setSelectedEstimate({ id: docRef.id, ...newEstimateData });
    setView('detail');
    setCurrentPage('home');
  };

  const handleUpdateEstimate = async (id, data) => {
    if (!db || !userId) return;
    const estimateDoc = doc(
      db,
      'artifacts',
      appId,
      'users',
      userId,
      'estimates',
      id
    );
    await updateDoc(estimateDoc, data);
  };

  const handleUpdateSettings = async (newSettings) => {
    if (!db || !userId) return;
    const settingsDoc = doc(
      db,
      'artifacts',
      appId,
      'users',
      userId,
      'settings',
      'userSettings'
    );
    await setDoc(settingsDoc, newSettings, { merge: true });
  };

  const handleFinishSetup = async (settings) => {
    const finalSettings = { ...settings, setupComplete: true };
    await handleUpdateSettings(finalSettings);
    setUserSettings(finalSettings);
    setIsSetupComplete(true);
  };

  const handleDeleteEstimate = async (id) => {
    if (!db || !userId) return;
    const estimateDoc = doc(
      db,
      'artifacts',
      appId,
      'users',
      userId,
      'estimates',
      id
    );
    await deleteDoc(estimateDoc);
    if (selectedEstimate?.id === id) {
      setView('list');
      setSelectedEstimate(null);
    }
  };

  const handleSelectEstimate = (estimate) => {
    setSelectedEstimate(estimate);
    setView('detail');
  };

  const handleNewProjectClick = () => {
    setView('newProject');
  };

  const renderPage = () => {
    if (loading || isSetupComplete === null) {
      return (
        <div className='flex items-center justify-center h-full'>
          Loading...
        </div>
      );
    }

    if (!isSetupComplete) {
      return <SetupWizard onFinish={handleFinishSetup} />;
    }

    const goToList = () => {
      setSelectedEstimate(null);
      setView('list');
    };

    if (currentPage === 'setup') {
      return (
        <SetupPage
          initialSettings={userSettings}
          onSave={handleUpdateSettings}
          onBack={() => setCurrentPage('home')}
        />
      );
    }

    switch (view) {
      case 'list':
        return (
          <HomeScreen
            estimates={estimates}
            onSelect={handleSelectEstimate}
            onNew={handleNewProjectClick}
            onDelete={handleDeleteEstimate}
          />
        );
      case 'detail':
        if (selectedEstimate) {
          return (
            <EstimateDetail
              estimate={selectedEstimate}
              onUpdate={handleUpdateEstimate}
              onBack={goToList}
            />
          );
        }
        // Fallback to list if no estimate is selected
        setView('list');
        return (
          <HomeScreen
            estimates={estimates}
            onSelect={handleSelectEstimate}
            onNew={handleNewProjectClick}
            onDelete={handleDeleteEstimate}
          />
        );
      case 'newProject':
        return (
          <NewProjectForm onSave={handleSaveNewProject} onCancel={goToList} />
        );
      default:
        return (
          <HomeScreen
            estimates={estimates}
            onSelect={handleSelectEstimate}
            onNew={handleNewProjectClick}
            onDelete={handleDeleteEstimate}
          />
        );
    }
  };

  return (
    <div className='bg-slate-700 min-h-screen font-sans flex items-center justify-center p-4'>
      <div className='w-[390px] h-[844px] bg-slate-100 rounded-[50px] shadow-2xl border-[12px] border-black overflow-hidden relative flex flex-col'>
        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[160px] h-[30px] bg-black rounded-b-2xl z-30'></div>
        {isSetupComplete && (
          <header className='relative text-center pt-12 pb-6 bg-white border-b border-slate-200 sticky top-0 z-20 flex-shrink-0'>
            <h1 className='text-xl font-bold text-slate-800 tracking-tight'>
              Bathroom Calculator
            </h1>
            {currentPage === 'home' && view === 'list' && (
              <div className='absolute top-0 right-0 pt-12 pr-4 h-full flex items-center'>
                <button
                  onClick={() => setCurrentPage('setup')}
                  className='text-slate-500 hover:text-blue-600 p-2 rounded-full hover:bg-slate-100'
                >
                  <Settings size={22} />
                </button>
              </div>
            )}
          </header>
        )}
        <main className='flex-1 overflow-y-auto'>{renderPage()}</main>
      </div>
    </div>
  );
}
