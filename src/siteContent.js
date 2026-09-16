import heroImage from './assets/hero-kisetsu.jpg'
import featureTshirts from './assets/feature-tshirts.jpg'
import featurePaintings from './assets/feature-paintings.jpg'
import featureStudentArt from './assets/feature-student-art.jpg'
import featureWorkshops from './assets/feature-workshops.jpg'

// Every piece of copy the admin should be able to edit in place lives here,
// with defaults that match the original hard-coded site exactly so nothing
// changes visually until an admin actually edits something.
export const defaultSiteContent = {
  hero: {
    eyebrow: 'KISETSU EXPRESSIONS',
    title: 'Your Story,\nBeautifully Gifted.',
    description:
      'Original T-shirts, paintings, student art, and creative workshops made to celebrate the stories that make you who you are.',
    image: heroImage,
  },

  theme: {
    primaryColor: '#123b5d',
    accentColor: '#b22222',
    headingSize: 100,
    fontFamily: 'Arial, Helvetica, sans-serif',
  },

  features: [
    {
      key: 'tshirts',
      title: 'T-Shirts',
      image: featureTshirts,
      description:
        'Wear art that feels personal, expressive, and made to be seen.',
      action: 'Shop T-Shirts',
      href: '#tshirts',
    },
    {
      key: 'paintings',
      title: 'Paintings',
      image: featurePaintings,
      description:
        'Original work with colour, feeling, and a story for your space.',
      action: 'Explore Paintings',
      href: '#paintings',
    },
    {
      key: 'studentArt',
      title: 'Student Art',
      image: featureStudentArt,
      description:
        'A celebration of young artists, new perspectives, and proud creative moments.',
      action: 'Explore Student Art',
      href: '#student-art',
    },
    {
      key: 'workshops',
      title: 'Workshops',
      image: featureWorkshops,
      description:
        'Bring people together through a guided, hands-on creative experience.',
      action: 'Plan Your Creative Workshop',
      href: '#workshops',
    },
  ],

  discover: {
    eyebrow: 'CHOOSE YOUR EXPRESSION',
    heading: 'Made for every\ncreative moment.',
  },

  intro: {
    eyebrow: 'KISETSU EXPRESSIONS',
    heading: "More than a shirt.\nIt's an expression.",
    paragraph:
      'At Kisetsu Expressions, we believe what you wear can say something about who you are. Our T-shirts are created to bring personality, creativity, and meaning into everyday style.',
  },

  paintingsSection: {
    eyebrow: 'ORIGINAL PAINTINGS',
    heading: 'Art that gives\na room a story.',
    description:
      'Discover original paintings created to bring warmth, colour, and a personal sense of expression into your space.',
    buttonLabel: 'Explore Paintings →',
  },

  studentArtSection: {
    eyebrow: 'STUDENT ART',
    heading: 'Big imagination.\nProudly shared.',
    description:
      'Student art is where confidence grows and new voices emerge. Explore the creativity, care, and individuality behind each piece.',
    buttonLabel: 'Explore Student Art →',
  },

  workshopsSection: {
    eyebrow: 'CREATIVE WORKSHOPS',
    heading: 'Make something\nmeaningful together.',
    description:
      'Plan a relaxed, guided art experience for your group. Tell us your preferred date, group size, and creative idea, and we will help shape the session.',
  },

  // Current website promotion / announcement.
  // Keep enabled false while the feature is being developed and tested.
  //
  // The promotion ID is important. When a visitor closes this promotion,
  // the browser can remember this specific ID. A future promotion with a
  // different ID can therefore appear again.
  promotion: {
    id: 'arts-drawing-classes-2026',
    enabled: false,
    showPopup: true,
    showOnHomepage: true,
    title: 'Arts & Drawing Classes',
    description:
      'A fun and engaging creative experience for kids and beginners.',
    image: '',
    buttonLabel: 'Learn More',
  },

  about: {
    heading: 'Made to\nexpress.',
    paragraph1:
      'Kisetsu Expressions is a creative T-shirt brand focused on meaningful designs and expressive everyday wear.',
    paragraph2:
      'Each design is created with the idea that clothing can be more than something you wear. It can represent an idea, a feeling, a memory, or simply your personality.',
    paragraph3:
      'This is just the beginning. As Kisetsu grows, more products and creative expressions will be introduced.',
  },

  tshirtsSection: {
    eyebrow: 'THE COLLECTION',
    heading: 'T-Shirts made\nto be seen.',
  },

  cta: {
    eyebrow: 'READY TO EXPRESS YOURSELF?',
    heading: 'Find your\nexpression.',
    description:
      "See something you like? Contact Kisetsu Expressions directly and let's get your T-shirt ready.",
  },

  contact: {
    heading: "Let's talk\nT-shirts.",
  },

  // Per-element typography/appearance overrides, keyed by the same dot-path
  // used to look up the text itself (e.g. "hero.title"). Empty by default.
  styles: {},
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function deepMerge(base, saved) {
  if (!isPlainObject(base)) {
    return saved !== undefined ? saved : base
  }

  const result = { ...base }

  if (isPlainObject(saved)) {
    for (const key of Object.keys(base)) {
      result[key] = deepMerge(base[key], saved[key])
    }

    for (const key of Object.keys(saved)) {
      if (!(key in base)) {
        result[key] = saved[key]
      }
    }
  }

  return result
}

export function mergeSiteContent(savedContent) {
  const merged = deepMerge(defaultSiteContent, savedContent || {})

  // Saved CMS content may contain old development asset paths
  // such as "/src/assets/hero-kisetsu.jpg".
  //
  // Those paths do not work correctly in a Vite production deployment.
  // Keep the Vite-imported production asset instead.
  if (
    typeof savedContent?.hero?.image === 'string' &&
    savedContent.hero.image.startsWith('/src/assets/')
  ) {
    merged.hero.image = defaultSiteContent.hero.image
  }

  // Merge feature cards by their stable key rather than only by array
  // position. This also protects old saved "/src/assets/" image paths.
  merged.features = defaultSiteContent.features.map((feature) => {
    const savedFeature = savedContent?.features?.find(
      (item) => item.key === feature.key
    )

    const mergedFeature = {
      ...feature,
      ...(savedFeature || {}),
    }

    if (
      typeof savedFeature?.image === 'string' &&
      savedFeature.image.startsWith('/src/assets/')
    ) {
      mergedFeature.image = feature.image
    }

    return mergedFeature
  })

  return merged
}

export function getByPath(obj, path) {
  return path
    .split('.')
    .reduce((acc, key) => (acc == null ? acc : acc[key]), obj)
}

export function setByPath(obj, path, value) {
  const keys = path.split('.')
  const clone = Array.isArray(obj) ? [...obj] : { ...obj }

  let cursor = clone

  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i]
    const next = cursor[key]

    cursor[key] = Array.isArray(next)
      ? [...next]
      : { ...(next || {}) }

    cursor = cursor[key]
  }

  cursor[keys[keys.length - 1]] = value

  return clone
}