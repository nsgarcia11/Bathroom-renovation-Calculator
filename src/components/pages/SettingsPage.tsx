'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useContractor } from '@/hooks/use-contractor';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Building2,
  CreditCard,
  Bell,
  Shield,
  HelpCircle,
  Edit,
  Check,
} from 'lucide-react';

export function SettingsPage() {
  const router = useRouter();
  const { data: contractor, isLoading } = useContractor();
  const [activeTab, setActiveTab] = useState('contractor');

  const settingsTabs = [
    {
      id: 'contractor',
      name: 'Contractor Information',
      icon: Building2,
      description: 'Manage your company details and contact information',
    },
    {
      id: 'billing',
      name: 'Billing & Subscription',
      icon: CreditCard,
      description: 'Manage your subscription and payment methods',
    },
    {
      id: 'notifications',
      name: 'Notifications',
      icon: Bell,
      description: 'Configure email and app notifications',
    },
    {
      id: 'security',
      name: 'Security',
      icon: Shield,
      description: 'Manage your account security settings',
    },
    {
      id: 'help',
      name: 'Help & Support',
      icon: HelpCircle,
      description: 'Get help and contact support',
    },
  ];

  const handleEditContractor = () => {
    router.push('/setup');
  };

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <AppHeader
        title='Settings'
        subtitle='Manage your account settings and preferences'
        showBackButton={true}
        backButtonText='Back to Dashboard'
      />

      <div className='py-8 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
            {/* Settings Navigation */}
            <div className='lg:col-span-1'>
              <Card>
                <CardContent className='p-0'>
                  <nav className='space-y-1'>
                    {settingsTabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full text-left px-4 py-3 flex items-center space-x-3 transition-colors ${
                            activeTab === tab.id
                              ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className='h-5 w-5' />
                          <div>
                            <div className='font-medium'>{tab.name}</div>
                            <div className='text-sm text-gray-500'>
                              {tab.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Settings Content */}
            <div className='lg:col-span-3'>
              {activeTab === 'contractor' && (
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center space-x-2'>
                      <Building2 className='h-5 w-5' />
                      <span>Contractor Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    {contractor ? (
                      <>
                        <Alert>
                          <Check className='h-4 w-4' />
                          <AlertDescription>
                            Your contractor information is set up and ready to
                            use.
                          </AlertDescription>
                        </Alert>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                          <div>
                            <h3 className='font-medium text-gray-900 mb-2'>
                              Company Details
                            </h3>
                            <div className='space-y-2 text-sm'>
                              <div>
                                <span className='font-medium'>
                                  Company Name:
                                </span>
                                <span className='ml-2 text-gray-600'>
                                  {contractor.name}
                                </span>
                              </div>
                              <div>
                                <span className='font-medium'>Address:</span>
                                <span className='ml-2 text-gray-600'>
                                  {contractor.address}
                                </span>
                              </div>
                              <div>
                                <span className='font-medium'>
                                  Postal Code:
                                </span>
                                <span className='ml-2 text-gray-600'>
                                  {contractor.postal_code}
                                </span>
                              </div>
                              <div>
                                <span className='font-medium'>Province:</span>
                                <span className='ml-2 text-gray-600'>
                                  {contractor.province}
                                </span>
                              </div>
                              <div>
                                <span className='font-medium'>Tax Rate:</span>
                                <span className='ml-2 text-gray-600'>
                                  {(contractor.tax_rate * 100).toFixed(2)}%
                                </span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h3 className='font-medium text-gray-900 mb-2'>
                              Contact Information
                            </h3>
                            <div className='space-y-2 text-sm'>
                              <div>
                                <span className='font-medium'>Email:</span>
                                <span className='ml-2 text-gray-600'>
                                  {contractor.email}
                                </span>
                              </div>
                              <div>
                                <span className='font-medium'>Phone:</span>
                                <span className='ml-2 text-gray-600'>
                                  {contractor.phone}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className='flex space-x-4'>
                          <Button
                            onClick={handleEditContractor}
                            className='flex items-center space-x-2'
                          >
                            <Edit className='h-4 w-4' />
                            <span>Edit Information</span>
                          </Button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Alert variant='destructive'>
                          <AlertDescription>
                            No contractor information found. Please set up your
                            contractor details to get started.
                          </AlertDescription>
                        </Alert>

                        <div className='text-center py-8'>
                          <Building2 className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                          <h3 className='text-lg font-medium text-gray-900 mb-2'>
                            Set Up Your Contractor Information
                          </h3>
                          <p className='text-gray-600 mb-6'>
                            Add your company details, contact information, and
                            tax settings.
                          </p>
                          <Button
                            onClick={handleEditContractor}
                            className='flex items-center space-x-2'
                          >
                            <Building2 className='h-4 w-4' />
                            <span>Set Up Contractor Info</span>
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}

              {activeTab === 'billing' && (
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center space-x-2'>
                      <CreditCard className='h-5 w-5' />
                      <span>Billing & Subscription</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-center py-8'>
                      <CreditCard className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                      <h3 className='text-lg font-medium text-gray-900 mb-2'>
                        Subscription Management
                      </h3>
                      <p className='text-gray-600 mb-6'>
                        Manage your subscription and billing information.
                      </p>
                      <Button onClick={() => router.push('/subscription')}>
                        Manage Subscription
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'notifications' && (
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center space-x-2'>
                      <Bell className='h-5 w-5' />
                      <span>Notifications</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-center py-8'>
                      <Bell className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                      <h3 className='text-lg font-medium text-gray-900 mb-2'>
                        Notification Settings
                      </h3>
                      <p className='text-gray-600 mb-6'>
                        Configure your notification preferences.
                      </p>
                      <Alert>
                        <AlertDescription>
                          Notification settings will be available in a future
                          update.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'security' && (
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center space-x-2'>
                      <Shield className='h-5 w-5' />
                      <span>Security</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-center py-8'>
                      <Shield className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                      <h3 className='text-lg font-medium text-gray-900 mb-2'>
                        Security Settings
                      </h3>
                      <p className='text-gray-600 mb-6'>
                        Manage your account security and authentication.
                      </p>
                      <Alert>
                        <AlertDescription>
                          Security settings will be available in a future
                          update.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'help' && (
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center space-x-2'>
                      <HelpCircle className='h-5 w-5' />
                      <span>Help & Support</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-6'>
                      <div className='text-center py-8'>
                        <HelpCircle className='h-12 w-12 text-gray-400 mx-auto mb-4' />
                        <h3 className='text-lg font-medium text-gray-900 mb-2'>
                          Need Help?
                        </h3>
                        <p className='text-gray-600 mb-6'>
                          Get help with using the bathroom renovation
                          calculator.
                        </p>
                      </div>

                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <Card>
                          <CardContent className='p-4'>
                            <h4 className='font-medium text-gray-900 mb-2'>
                              Documentation
                            </h4>
                            <p className='text-sm text-gray-600 mb-4'>
                              Learn how to use all features of the calculator.
                            </p>
                            <Button variant='outline' size='sm' disabled>
                              View Docs
                            </Button>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardContent className='p-4'>
                            <h4 className='font-medium text-gray-900 mb-2'>
                              Contact Support
                            </h4>
                            <p className='text-sm text-gray-600 mb-4'>
                              Get help from our support team.
                            </p>
                            <Button variant='outline' size='sm' disabled>
                              Contact Us
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
