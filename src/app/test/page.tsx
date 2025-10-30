import MCPTestComponent from '@/components/common/MCPTestComponent'
import DatabaseStatus from '@/components/common/DatabaseStatus'

export default function TestPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">MCP Integration Test</h1>
        <p className="text-gray-600">
          Test and monitor the Model Context Protocol (MCP) integration with Supabase database.
        </p>
      </div>
      
      <div className="space-y-8">
        {/* Database Status Component */}
        <DatabaseStatus />
        
        {/* MCP Test Component */}
        <MCPTestComponent />
      </div>
    </div>
  )
}