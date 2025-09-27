'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useSubscription } from '@/contexts/SubscriptionContext';
import {
  AlertTriangle,
  Trash2,
  QrCode,
  BarChart3,
  DollarSign,
  X,
  CheckCircle
} from 'lucide-react';

interface ProjectDeletionWarningProps {
  projectId: string;
  projectName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ProjectDeletionWarning({
  projectId,
  projectName,
  onConfirm,
  onCancel
}: ProjectDeletionWarningProps) {
  const { currentTier, getProjectAnalytics, additionalProjects } = useSubscription();
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');

  const projectAnalytics = getProjectAnalytics(projectId);
  const isBusinessCardTier = currentTier === 'business-card';
  const hasQRCode = projectAnalytics?.qrCodeId;
  const hasScans = projectAnalytics && projectAnalytics.totalScans > 0;

  const handleConfirm = () => {
    setIsConfirming(true);
    // Small delay to show the user we're processing
    setTimeout(() => {
      onConfirm();
    }, 1000);
  };

  const isDeleteEnabled = confirmationText.toLowerCase() === 'delete';

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">

        {/* Header */}
        <div className="p-6 border-b border-red-200 bg-red-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-red-900">Delete Project</h2>
              <p className="text-red-700">This action cannot be undone</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">

          {/* Project Info */}
          <div className="bg-gray-50 border rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Project to Delete:</h3>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded">
                <QrCode className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="font-medium text-gray-900">{projectName}</div>
                <div className="text-sm text-gray-600">Project ID: {projectId}</div>
              </div>
            </div>
          </div>

          {/* Critical Warnings */}
          <div className="space-y-4">

            {/* QR Code Warning */}
            {hasQRCode && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <QrCode className="w-5 h-5 text-red-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-red-900 mb-2">
                      ⚠️ Unique QR Code Will Be Lost
                    </h4>
                    <p className="text-sm text-red-800 mb-3">
                      This project has a unique QR code that will be permanently deleted.
                      The QR code cannot be recovered and any printed materials using this
                      code will no longer work.
                    </p>
                    <div className="bg-red-100 border border-red-300 rounded p-3">
                      <div className="text-xs font-mono text-red-800">
                        QR Code ID: {projectAnalytics?.qrCodeId}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics Data Warning */}
            {hasScans && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <BarChart3 className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-orange-900 mb-2">
                      📊 Analytics Data Will Be Lost
                    </h4>
                    <p className="text-sm text-orange-800 mb-3">
                      All scan analytics and tracking data for this project will be permanently deleted.
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="bg-orange-100 border border-orange-300 rounded p-2">
                        <div className="font-semibold text-orange-900">
                          {projectAnalytics?.totalScans || 0} Total Scans
                        </div>
                      </div>
                      <div className="bg-orange-100 border border-orange-300 rounded p-2">
                        <div className="font-semibold text-orange-900">
                          {projectAnalytics?.dailyScans.length || 0} Days of Data
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Business Card Tier Warning */}
            {isBusinessCardTier && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <DollarSign className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-yellow-900 mb-2">
                      💰 Replacement Cost
                    </h4>
                    <p className="text-sm text-yellow-800 mb-3">
                      To create a new project with a unique QR code, you will need to
                      purchase an additional project for <strong>$10.00</strong>.
                    </p>
                    <div className="bg-yellow-100 border border-yellow-300 rounded p-3">
                      <div className="text-sm text-yellow-800">
                        Current additional projects: <strong>{additionalProjects}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-3">Before you delete:</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-600 rounded flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-blue-600" />
                  </div>
                  <span>Download QR code and analytics data if needed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-600 rounded flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-blue-600" />
                  </div>
                  <span>Update any printed materials with new QR codes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-blue-600 rounded flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-blue-600" />
                  </div>
                  <span>Consider duplicating project instead of deleting</span>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Input */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type <span className="font-mono bg-gray-100 px-1 rounded">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {confirmationText && confirmationText.toLowerCase() !== 'delete' && (
              <p className="text-sm text-red-600">
                Please type "DELETE" exactly as shown above.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isConfirming}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>

            <Button
              onClick={handleConfirm}
              disabled={!isDeleteEnabled || isConfirming}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-300"
            >
              {isConfirming ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Project Permanently
                </>
              )}
            </Button>
          </div>

          {/* Final Warning */}
          <div className="bg-gray-50 border rounded-lg p-3">
            <p className="text-xs text-gray-600 text-center">
              This action is permanent and cannot be undone. All project data,
              QR codes, and analytics will be lost forever.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
