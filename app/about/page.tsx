import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">About the project</h1>
      <p className="text-xl text-muted-foreground">
        Discover and compare quality of life metrics across cities worldwide.
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>Our Mission</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Country Explorer aims to provide comprehensive, up-to-date information about cities around the world,
            helping people make informed decisions about where to live, work, or travel. We gather and analyze
            data on cost of living, safety, healthcare, and more to give you a clear picture of life in different locations.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            We collect data from various reliable sources, including government statistics, reputable surveys,
            and user contributions. Our advanced algorithms process this information to provide accurate
            comparisons and insights. We regularly update our database to ensure the most current information is available.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-6 space-y-2">
            <li>Comprehensive city profiles with detailed quality of life metrics</li>
            <li>Easy-to-use comparison tools for multiple cities</li>
            <li>Regular updates to ensure data accuracy</li>
            <li>User-friendly interface with intuitive navigation</li>
            <li>Mobile-responsive design for on-the-go access</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Get Involved</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            We welcome contributions from users like you! Share your experiences, suggest improvements,
            or report any discrepancies you find. Together, we can build the most accurate and helpful
            resource for city information worldwide.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
