'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Users, Share2, Clock, TrendingUp, Download, MapPin } from 'lucide-react';

export function AnalyticsPanel() {
  const [analytics, setAnalytics] = useState({
    totalViews: 1247,
    uniqueUsers: 856,
    averageTime: 145, // seconds
    shares: 89,
    topCountries: [
      { name: 'United States', views: 423 },
      { name: 'United Kingdom', views: 312 },
      { name: 'Germany', views: 198 },
      { name: 'France', views: 156 }
    ],
    deviceBreakdown: {
      mobile: 65,
      tablet: 20,
      desktop: 15
    },
    hourlyViews: [12, 8, 15, 23, 34, 45, 56, 67, 78, 65, 54, 43]
  });

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-semibold text-lg">Analytics Dashboard</h3>
        <Button size="sm" variant="outline" className="bg-white/5 border-white/20 text-white">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-lg p-4 border border-blue-400/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Total Views</p>
              <p className="text-white text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
            </div>
            <Eye className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-lg p-4 border border-green-400/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm">Unique Users</p>
              <p className="text-white text-2xl font-bold">{analytics.uniqueUsers.toLocaleString()}</p>
            </div>
            <Users className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 rounded-lg p-4 border border-purple-400/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Avg. Time</p>
              <p className="text-white text-2xl font-bold">{formatTime(analytics.averageTime)}</p>
            </div>
            <Clock className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-900/30 to-red-900/30 rounded-lg p-4 border border-orange-400/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-200 text-sm">Shares</p>
              <p className="text-white text-2xl font-bold">{analytics.shares}</p>
            </div>
            <Share2 className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Views Chart */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <h4 className="text-white font-medium mb-3 flex items-center">
          <TrendingUp className="w-4 h-4 mr-2" />
          Hourly Views (Last 12 Hours)
        </h4>
        <div className="flex items-end space-x-1 h-24">
          {analytics.hourlyViews.map((views, index) => (
            <div
              key={index}
              className="bg-cyan-500 rounded-t flex-1 transition-all duration-300 hover:bg-cyan-400"
              style={{ height: `${(views / Math.max(...analytics.hourlyViews)) * 100}%` }}
              title={`${views} views`}
            />
          ))}
        </div>
        <div className="flex justify-between text-white/60 text-xs mt-2">
          <span>12h ago</span>
          <span>6h ago</span>
          <span>Now</span>
        </div>
      </div>

      {/* Top Countries */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <h4 className="text-white font-medium mb-3 flex items-center">
          <MapPin className="w-4 h-4 mr-2" />
          Top Countries
        </h4>
        <div className="space-y-2">
          {analytics.topCountries.map((country, index) => (
            <div key={country.name} className="flex items-center justify-between">
              <span className="text-white/80 text-sm">{country.name}</span>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-cyan-500 h-2 rounded-full"
                    style={{ width: `${(country.views / analytics.topCountries[0].views) * 100}%` }}
                  />
                </div>
                <span className="text-white/60 text-sm w-12 text-right">{country.views}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Device Breakdown */}
      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
        <h4 className="text-white font-medium mb-3">Device Breakdown</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">📱 Mobile</span>
            <span className="text-white font-medium">{analytics.deviceBreakdown.mobile}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">📊 Tablet</span>
            <span className="text-white font-medium">{analytics.deviceBreakdown.tablet}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">💻 Desktop</span>
            <span className="text-white font-medium">{analytics.deviceBreakdown.desktop}%</span>
          </div>
        </div>

        {/* Visual breakdown */}
        <div className="mt-3 h-3 bg-gray-700 rounded-full overflow-hidden flex">
          <div
            className="bg-blue-500"
            style={{ width: `${analytics.deviceBreakdown.mobile}%` }}
          />
          <div
            className="bg-green-500"
            style={{ width: `${analytics.deviceBreakdown.tablet}%` }}
          />
          <div
            className="bg-purple-500"
            style={{ width: `${analytics.deviceBreakdown.desktop}%` }}
          />
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-lg p-4 border border-cyan-400/20">
        <h4 className="text-cyan-300 font-medium mb-2">Performance Insights</h4>
        <ul className="text-cyan-100/80 text-sm space-y-1">
          <li>• 📈 Views increased 23% this week</li>
          <li>• ⏱️ Average session time up 15%</li>
          <li>• 🔄 Share rate: 7.1% (above average)</li>
          <li>• 📱 Mobile engagement is strongest</li>
        </ul>
      </div>
    </div>
  );
}
