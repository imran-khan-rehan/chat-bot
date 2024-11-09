import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ChatDashboard() {
  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">Chat Dashboard</h2>
          <Button>New Chat</Button>
        </div>

        {/* Chat Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Chat List */}
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Chats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <p>User A</p>
                <span className="text-sm text-muted">2 mins ago</span>
              </div>
              <div className="flex items-center justify-between">
                <p>User B</p>
                <span className="text-sm text-muted">5 mins ago</span>
              </div>
              <div className="flex items-center justify-between">
                <p>User C</p>
                <span className="text-sm text-muted">10 mins ago</span>
              </div>
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Chat with User A</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
              <div className="flex justify-start">
                <div className="bg-gray-200 p-3 rounded-lg">Hi there!</div>
              </div>
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white p-3 rounded-lg">Hello!</div>
              </div>
              <div className="flex justify-start">
                <div className="bg-gray-200 p-3 rounded-lg">How are you?</div>
              </div>
              {/* Chat Input */}
              <div className="mt-4 flex">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-grow p-2 border border-gray-300 rounded-l-lg"
                />
                <Button className="rounded-r-lg">Send</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
