import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Get parameters from URL
    const title = searchParams.get('title') || 'Monarch Labs'
    const description = searchParams.get('description') || 'Next.js SaaS Starter'
    const type = searchParams.get('type') || 'website'
    const theme = searchParams.get('theme') || 'dark'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme === 'dark' ? '#0b0b0b' : '#ffffff',
            backgroundImage:
              theme === 'dark'
                ? 'radial-gradient(1200px 400px at 10% 20%, rgba(255, 255, 255, 0.04), transparent 60%), radial-gradient(800px 300px at 80% 0%, rgba(139, 92, 246, 0.07), transparent 70%), linear-gradient(180deg, rgba(255, 255, 255, 0.03), transparent 25%)'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                theme === 'dark'
                  ? 'repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.03) 1px, transparent 2px, transparent 4px)'
                  : 'repeating-linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1) 1px, transparent 2px, transparent 4px)',
            }}
          />

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px',
              maxWidth: '1000px',
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            {/* Logo/Brand */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '40px',
              }}
            >
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #7c3aed 0%, #22d3ee 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '20px',
                }}
              >
                <div
                  style={{
                    color: 'white',
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  M
                </div>
              </div>
              <div
                style={{
                  fontSize: '32px',
                  fontWeight: '800',
                  color: theme === 'dark' ? '#e6e6e6' : '#1a1a1a',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Monarch Labs
              </div>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: '64px',
                fontWeight: '800',
                marginBottom: '20px',
                lineHeight: 1.1,
                textAlign: 'center',
                maxWidth: '900px',
                background:
                  type === 'article' ? 'linear-gradient(135deg, #7c3aed 0%, #22d3ee 100%)' : 'none',
                backgroundClip: type === 'article' ? 'text' : 'initial',
                color:
                  type === 'article' ? 'transparent' : theme === 'dark' ? '#e6e6e6' : '#1a1a1a',
              }}
            >
              {title}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: '28px',
                color: theme === 'dark' ? '#a1a1aa' : '#4a5568',
                marginBottom: '40px',
                lineHeight: 1.4,
                maxWidth: '800px',
                textAlign: 'center',
              }}
            >
              {description}
            </div>

            {/* Type Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 24px',
                borderRadius: '8px',
                background:
                  theme === 'dark' ? 'rgba(124, 58, 237, 0.1)' : 'rgba(124, 58, 237, 0.1)',
                border: `1px solid ${theme === 'dark' ? 'rgba(124, 58, 237, 0.3)' : 'rgba(124, 58, 237, 0.3)'}`,
                color: theme === 'dark' ? '#7c3aed' : '#7c3aed',
                fontSize: '18px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {type}
            </div>
          </div>

          {/* Bottom Accent */}
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              right: '0',
              height: '8px',
              background: 'linear-gradient(90deg, #7c3aed 0%, #22d3ee 50%, #7c3aed 100%)',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  } catch (error) {
    console.error('Error generating OpenGraph image:', error)

    // Fallback image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0b0b0b',
            color: '#e6e6e6',
            fontSize: '32px',
            fontWeight: 'bold',
          }}
        >
          Monarch Labs
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    )
  }
}
