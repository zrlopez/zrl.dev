import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Zachary Ryan Lopez — AI/ML Data Specialist'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage() {
  const nunitoBold = await fetch(
    new URL('https://fonts.gstatic.com/s/nunito/v26/XRXI3I6Li01BKofiOc5wtlZ2di8HDIkhdTQ3j6zbXWjgeg.woff2')
  ).then((r) => r.arrayBuffer())

  return new ImageResponse(
    (
      <div
        style={{
          width:           '1200px',
          height:          '630px',
          display:         'flex',
          flexDirection:   'column',
          justifyContent:  'space-between',
          backgroundColor: '#050812',
          padding:         '56px 72px',
          fontFamily:      'Nunito, sans-serif',
          position:        'relative',
          overflow:        'hidden',
        }}
      >
        {/* Subtle radial glow — top-left */}
        <div
          style={{
            position:      'absolute',
            top:           '-120px',
            left:          '-120px',
            width:         '600px',
            height:        '600px',
            borderRadius:  '50%',
            background:    'radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        {/* Subtle radial glow — bottom-right */}
        <div
          style={{
            position:      'absolute',
            bottom:        '-160px',
            right:         '-80px',
            width:         '640px',
            height:        '640px',
            borderRadius:  '50%',
            background:    'radial-gradient(circle, rgba(148,163,184,0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── Top row: zrl mark + domain ── */}
        <div
          style={{
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
          }}
        >
          {/* zrl mark — crimson pill matching favicon + nav */}
          <div
            style={{
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              width:           '100px',
              height:          '100px',
              borderRadius:    '18px',
              backgroundColor: '#c0281d',
            }}
          >
            <span
              style={{
                fontSize:    '44px',
                fontWeight:  '800',
                fontStyle:   'italic',
                color:       '#ffffff',
                lineHeight:  1,
                letterSpacing: '-1px',
              }}
            >
              zrl
            </span>
          </div>

          {/* Domain */}
          <span
            style={{
              fontSize:    '28px',
              fontWeight:  '600',
              color:       'rgba(148,163,184,0.6)',
              letterSpacing: '0.02em',
            }}
          >
            zrl.dev
          </span>
        </div>

        {/* ── Center: name + title ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
            <span
              style={{
                fontSize:    '72px',
                fontWeight:  '800',
                color:       '#f8fafc',
                lineHeight:  1,
                letterSpacing: '-2px',
              }}
            >
              Zachary
            </span>
            <span
              style={{
                fontSize:    '72px',
                fontWeight:  '800',
                color:       '#f8fafc',
                lineHeight:  1,
                letterSpacing: '-2px',
              }}
            >
              Ryan
            </span>
            <span
              style={{
                fontSize:    '72px',
                fontWeight:  '800',
                color:       'rgba(148,163,184,0.85)',
                lineHeight:  1,
                letterSpacing: '-2px',
              }}
            >
              Lopez
            </span>
          </div>

          <span
            style={{
              fontSize:    '30px',
              fontWeight:  '600',
              color:       'rgba(148,163,184,0.7)',
              letterSpacing: '0.02em',
            }}
          >
            AI/ML Data Specialist · Technical Support Engineer
          </span>
        </div>

        {/* ── Bottom: tag line ── */}
        <div
          style={{
            display:     'flex',
            alignItems:  'center',
            gap:         '12px',
          }}
        >
          <div
            style={{
              width:           '4px',
              height:          '32px',
              borderRadius:    '2px',
              backgroundColor: '#c0281d',
            }}
          />
          <span
            style={{
              fontSize:    '22px',
              fontWeight:  '600',
              color:       'rgba(148,163,184,0.5)',
              letterSpacing: '0.04em',
            }}
          >
            Data Operations · ML/AI · Front-End Engineering
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name:   'Nunito',
          data:   nunitoBold,
          style:  'italic',
          weight: 800,
        },
      ],
    }
  )
}
