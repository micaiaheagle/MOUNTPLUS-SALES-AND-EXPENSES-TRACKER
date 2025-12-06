'use client';

import { AlertCircle, CheckCircle, TrendingUp, Target } from 'lucide-react';

interface QuickInsightsProps {
  todaySales: number;
  monthExpenses: number;
  outstandingCredit: number;
  jobsInProgress: number;
  topCustomer: string;
  topCustomerAmount: number;
}

export default function QuickInsights({
  todaySales,
  monthExpenses,
  outstandingCredit,
  jobsInProgress,
  topCustomer,
  topCustomerAmount
}: QuickInsightsProps) {
  
  const insights = [];

  // Sales Insights
  if (todaySales > 0) {
    insights.push({
      type: 'success',
      icon: CheckCircle,
      message: `Great! You've made $${todaySales.toFixed(2)} in sales today.`,
      action: 'Keep up the momentum!'
    });
  } else {
    insights.push({
      type: 'warning',
      icon: AlertCircle,
      message: 'No sales recorded today yet.',
      action: 'Time to close some deals!'
    });
  }

  // Outstanding Credit Alert
  if (outstandingCredit > 0) {
    insights.push({
      type: 'warning',
      icon: AlertCircle,
      message: `You have $${outstandingCredit.toFixed(2)} in outstanding credit.`,
      action: 'Follow up with customers for payment.'
    });
  }

  // Jobs in Progress
  if (jobsInProgress > 0) {
    insights.push({
      type: 'info',
      icon: Target,
      message: `${jobsInProgress} job${jobsInProgress > 1 ? 's' : ''} currently in progress.`,
      action: 'Stay focused on delivery!'
    });
  }

  // Top Customer
  if (topCustomer && topCustomerAmount > 0) {
    insights.push({
      type: 'success',
      icon: TrendingUp,
      message: `${topCustomer} is your top customer with $${topCustomerAmount.toFixed(2)} in total sales.`,
      action: 'Consider a loyalty reward!'
    });
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
      <h3 className="font-bold text-gray-800 mb-3 uppercase text-xs tracking-wider flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-blue-600" />
        Quick Insights & Recommendations
      </h3>
      <div className="space-y-3">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg ${
                insight.type === 'success' ? 'bg-green-50 border border-green-200' :
                insight.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                'bg-blue-50 border border-blue-200'
              }`}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  insight.type === 'success' ? 'text-green-600' :
                  insight.type === 'warning' ? 'text-yellow-600' :
                  'text-blue-600'
                }`}
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{insight.message}</p>
                <p className="text-xs text-gray-600 mt-1">{insight.action}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
