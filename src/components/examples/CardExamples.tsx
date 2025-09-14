import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui';

/**
 * Example component showcasing different Card variants and usage patterns
 * This can be used for testing and as a reference for developers
 */
export function CardExamples() {
  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold text-gray-900">Card Component Examples</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Default Card */}
        <Card>
          <CardHeader>
            <CardTitle>Default Card</CardTitle>
            <CardDescription>
              This is a default card with standard padding and shadow.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Card content goes here. This is the main content area of the card.
            </p>
          </CardContent>
          <CardFooter separator>
            <button className="btn-base btn-primary">Action</button>
          </CardFooter>
        </Card>

        {/* Hoverable Card */}
        <Card hoverable clickable>
          <CardHeader>
            <CardTitle>Hoverable Card</CardTitle>
            <CardDescription>
              This card has hover effects and is clickable.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Hover over this card to see the elevation effect.
            </p>
          </CardContent>
        </Card>

        {/* Compact Card */}
        <Card variant="compact" shadow="md">
          <CardHeader>
            <CardTitle level={4}>Compact Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              This card uses compact padding for tighter layouts.
            </p>
          </CardContent>
        </Card>

        {/* Spacious Card */}
        <Card variant="spacious" background="gray">
          <CardHeader separator>
            <CardTitle>Spacious Card</CardTitle>
            <CardDescription>
              This card has extra padding and a gray background.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">More content space available.</p>
              <p className="text-sm text-gray-600">Perfect for detailed information.</p>
            </div>
          </CardContent>
        </Card>

        {/* Metric Card Example */}
        <Card hoverable>
          <CardContent>
            <div className="metric-card">
              <div className="metric-label">Total Portfolio Value</div>
              <div className="metric-value">$125,430.50</div>
              <div className="metric-change positive">
                <span>↗</span>
                <span>+2.4% from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* No Border Card */}
        <Card border={false} shadow="lg">
          <CardHeader>
            <CardTitle>No Border Card</CardTitle>
            <CardDescription>
              This card has no border, only shadow for definition.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Clean look with shadow-only styling.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}