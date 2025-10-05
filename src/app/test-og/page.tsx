import Image from 'next/image'

export default function TestOGPage() {
  const ogImageUrl =
    '/api/og?title=Test%20Page&description=Testing%20OpenGraph%20Image%20Generation&type=website&theme=dark'

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">OpenGraph Image Test</h1>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Generated Image:</h2>
          <div className="border-2 border-gray-600 rounded-lg p-4">
            <Image
              src={ogImageUrl}
              alt="Test OpenGraph Image"
              width={1200}
              height={630}
              className="max-w-full h-auto"
            />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Image URL:</h2>
          <code className="bg-gray-800 p-2 rounded text-sm break-all">{ogImageUrl}</code>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Test Different Parameters:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Light Theme</h3>
              <Image
                src="/api/og?title=Light%20Theme&description=Testing%20light%20theme&type=website&theme=light"
                alt="Light Theme OG Image"
                width={600}
                height={315}
                className="w-full h-auto"
              />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Article Type</h3>
              <Image
                src="/api/og?title=Article%20Title&description=This%20is%20an%20article&type=article&theme=dark"
                alt="Article OG Image"
                width={600}
                height={315}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
