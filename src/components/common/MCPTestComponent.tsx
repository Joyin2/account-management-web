'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Database, CheckCircle, XCircle, Activity } from 'lucide-react'
import { supabase, dbOperations, mcpSupabase } from '@/lib/supabase'

interface DatabaseStats {
  table_count: number
  total_rows: number
  database_size: string
}

interface TableInfo {
  table_name: string
  row_count: number
}

export default function MCPTestComponent() {
  const [isLoading, setIsLoading] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connected' | 'error'>('idle')
  const [dbStats, setDbStats] = useState<DatabaseStats | null>(null)
  const [tables, setTables] = useState<TableInfo[]>([])
  const [error, setError] = useState<string | null>(null)
  const [testResults, setTestResults] = useState<string[]>([])

  // Test database connection
  const testConnection = async () => {
    setIsLoading(true)
    setError(null)
    setTestResults([])
    
    try {
      // Test basic Supabase connection
      const { data, error: healthError } = await supabase
        .from('transactions')
        .select('count', { count: 'exact', head: true })
      
      if (healthError) throw healthError
      
      setConnectionStatus('connected')
      setTestResults(prev => [...prev, '✅ Supabase connection successful'])
      
      // Test MCP health check
      try {
        const healthCheck = await mcpSupabase.healthCheck()
        const healthStatus = healthCheck.healthy ? 'healthy' : 'unhealthy'
        setTestResults(prev => [...prev, `✅ MCP health check: ${healthStatus}`])
      } catch (mcpError) {
        setTestResults(prev => [...prev, `⚠️ MCP health check failed: ${mcpError}`])
      }
      
    } catch (err: any) {
      setConnectionStatus('error')
      setError(err.message)
      setTestResults(prev => [...prev, `❌ Connection failed: ${err.message}`])
    } finally {
      setIsLoading(false)
    }
  }

  // Get database statistics
  const getDatabaseStats = async () => {
    setIsLoading(true)
    try {
      const stats = await mcpSupabase.getDatabaseStats()
      setDbStats(stats)
      setTestResults(prev => [...prev, '✅ Database statistics retrieved'])
    } catch (err: any) {
      setError(err.message)
      setTestResults(prev => [...prev, `❌ Stats failed: ${err.message}`])
    } finally {
      setIsLoading(false)
    }
  }

  // Get table information
  const getTableInfo = async () => {
    setIsLoading(true)
    try {
      // Get list of main tables
      const mainTables = ['transactions', 'employees', 'partners', 'loans', 'inventory']
      const tableInfo: TableInfo[] = []
      
      for (const tableName of mainTables) {
        try {
          const { count } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true })
          
          tableInfo.push({
            table_name: tableName,
            row_count: count || 0
          })
        } catch (err) {
          tableInfo.push({
            table_name: tableName,
            row_count: 0
          })
        }
      }
      
      setTables(tableInfo)
      setTestResults(prev => [...prev, '✅ Table information retrieved'])
    } catch (err: any) {
      setError(err.message)
      setTestResults(prev => [...prev, `❌ Table info failed: ${err.message}`])
    } finally {
      setIsLoading(false)
    }
  }

  // Test CRUD operations
  const testCRUDOperations = async () => {
    setIsLoading(true)
    try {
      // Test creating a sample partner record
      const samplePartner = {
        name: 'Test Partner MCP',
        email: 'test.mcp@example.com',
        phone: '1234567890',
        address: '123 Test Street, Test City',
        partner_type: 'Individual',
        join_date: new Date().toISOString().split('T')[0],
        is_active: true,
        equity_percentage: 10.0,
        initial_capital: 50000,
        current_capital_balance: 50000,
        pan_number: 'ABCDE1234F',
        aadhar_number: '123456789012',
        bank_details: 'Test Bank Account',
        notes: 'Test partner created by MCP integration test',
        user_id: 'mcp-test-user',
        organization_id: 'mcp-test-org'
      }
      
      const newPartner = await dbOperations.create('partners', samplePartner)
      setTestResults(prev => [...prev, `✅ Created partner: ${newPartner[0]?.id}`])
      
      // Test reading the partner
      const partners = await dbOperations.read('partners', { email: 'test.mcp@example.com' })
      setTestResults(prev => [...prev, `✅ Read ${partners.length} partner(s)`])
      
      // Test updating the partner
      if (partners.length > 0) {
        const updated = await dbOperations.update('partners', partners[0].id, {
          equity_percentage: 15.0
        })
        setTestResults(prev => [...prev, `✅ Updated partner equity percentage`])
        
        // Test deleting the partner
        await dbOperations.delete('partners', partners[0].id)
        setTestResults(prev => [...prev, `✅ Deleted test partner`])
      }
      
    } catch (err: any) {
      setError(err.message)
      setTestResults(prev => [...prev, `❌ CRUD test failed: ${err.message}`])
    } finally {
      setIsLoading(false)
    }
  }

  // Run all tests
  const runAllTests = async () => {
    await testConnection()
    if (connectionStatus !== 'error') {
      await getDatabaseStats()
      await getTableInfo()
      await testCRUDOperations()
    }
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            MCP Supabase Integration Test
          </CardTitle>
          <CardDescription>
            Test the Model Context Protocol (MCP) integration with Supabase database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2">
            <span className="font-medium">Connection Status:</span>
            {connectionStatus === 'idle' && (
              <Badge variant="secondary">Not Tested</Badge>
            )}
            {connectionStatus === 'connected' && (
              <Badge variant="default" className="bg-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            )}
            {connectionStatus === 'error' && (
              <Badge variant="destructive">
                <XCircle className="h-3 w-3 mr-1" />
                Error
              </Badge>
            )}
          </div>

          {/* Test Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button 
              onClick={testConnection} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Test Connection
            </Button>
            <Button 
              onClick={getDatabaseStats} 
              disabled={isLoading || connectionStatus !== 'connected'}
              variant="outline"
            >
              Get DB Stats
            </Button>
            <Button 
              onClick={getTableInfo} 
              disabled={isLoading || connectionStatus !== 'connected'}
              variant="outline"
            >
              Get Tables
            </Button>
            <Button 
              onClick={testCRUDOperations} 
              disabled={isLoading || connectionStatus !== 'connected'}
              variant="outline"
            >
              Test CRUD
            </Button>
            <Button 
              onClick={runAllTests} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Run All Tests
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Test Results */}
          {testResults.length > 0 && (
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Test Results
              </h4>
              <div className="bg-gray-50 p-3 rounded-md space-y-1 max-h-40 overflow-y-auto">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Database Statistics */}
      {dbStats && (
        <Card>
          <CardHeader>
            <CardTitle>Database Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{dbStats.table_count}</div>
                <div className="text-sm text-gray-600">Tables</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{dbStats.total_rows}</div>
                <div className="text-sm text-gray-600">Total Rows</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{dbStats.database_size}</div>
                <div className="text-sm text-gray-600">Database Size</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table Information */}
      {tables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Table Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {tables.map((table, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium capitalize">{table.table_name}</span>
                  <Badge variant="secondary">{table.row_count} rows</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}