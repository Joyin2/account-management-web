'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface DatabaseHealth {
  supabase: boolean;
  lastChecked: Date;
}

export default function DatabaseStatus() {
  const [health, setHealth] = useState<DatabaseHealth>({
    supabase: false,
    lastChecked: new Date()
  });
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)

  const checkDatabaseHealth = async () => {
    setLoading(true)
    try {
      // Test Supabase connection
      const { data, error } = await supabase.from('partners').select('count').limit(1);
      const supabaseHealthy = !error;
      
      setHealth({
        supabase: supabaseHealthy,
        lastChecked: new Date()
      })
    } catch (error) {
      console.error('Health check failed:', error)
      setHealth({
        supabase: false,
        lastChecked: new Date()
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkDatabaseHealth()
    
    // Check health every 30 seconds
    const interval = setInterval(checkDatabaseHealth, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600' : 'text-red-600'
  }

  const getStatusIcon = (status: boolean) => {
    return status ? '●' : '●'
  }

  const getStatusText = (status: boolean) => {
    return status ? 'Connected' : 'Disconnected'
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-2">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            Database Status
          </h3>
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <span className={`text-xs ${getStatusColor(health.supabase)}`}>
              {getStatusIcon(health.supabase)}
            </span>
            <span className="text-xs text-gray-600 dark:text-gray-400">Supabase</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              checkDatabaseHealth()
            }}
            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            disabled={loading}
          >
            Refresh
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-1 gap-4">
            {/* Supabase Status */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                  Supabase
                </h4>
                <span className={`text-sm font-medium ${getStatusColor(health.supabase)}`}>
                  {getStatusText(health.supabase)}
                </span>
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <div>PostgreSQL Database</div>
                <div>MCP Integration</div>
                <div>Real-time Subscriptions</div>
                <div>Authentication</div>
              </div>
            </div>
          </div>

          {/* Configuration Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Current Configuration
            </h4>
            <div className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
              <div>Primary Provider: Supabase</div>
              <div>Database: PostgreSQL</div>
              <div>MCP Enabled: Yes</div>
            </div>
          </div>

          {/* Last Checked */}
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Last checked: {health.lastChecked.toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  )
}

// Hook for using database status in other components
export function useDatabaseStatus() {
  const [health, setHealth] = useState<DatabaseHealth>({
    supabase: false,
    lastChecked: new Date()
  })

  const checkHealth = async () => {
    try {
      // Test Supabase connection
      const { data, error } = await supabase.from('partners').select('count').limit(1);
      const supabaseHealthy = !error;
      
      const healthStatus = {
        supabase: supabaseHealthy,
        lastChecked: new Date()
      };
      
      setHealth(healthStatus)
      return healthStatus
    } catch (error) {
      console.error('Health check failed:', error)
      const errorHealth = {
        supabase: false,
        lastChecked: new Date()
      }
      setHealth(errorHealth)
      return errorHealth
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  return { health, checkHealth }
}