import heroImage from './assets/hero-kisetsu.jpg'
import featureTshirts from './assets/feature-tshirts.jpg'
import featurePaintings from './assets/feature-paintings.jpg'
import featureStudentArt from './assets/feature-student-art.jpg'
import featureWorkshops from './assets/feature-workshops.jpg'

export const defaultSiteContent = {
  hero: {
    eyebrow: 'KISETSU EXPRESSIONS',
    title: 'Your Story,\nBeautifully Gifted.',
    description: 'Original T-shirts, paintings, student art, and creative workshops made to celebrate the stories that make you who you are.',
    image: heroImage,
  },
  theme: {
    primaryColor: '#123b5d',
    accentColor: '#b22222',
    headingSize: 100,
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  features: [
    { key: 'tshirts', title: 'T-Shirts', image: featureTshirts },
    { key: 'paintings', title: 'Paintings', image: featurePaintings },
    { key: 'studentArt', title: 'Student Art', image: featureStudentArt },
    { key: 'workshops', title: 'Workshops', image: featureWorkshops },
  ],
}

export function mergeSiteContent(savedContent) {
  return {
    ...defaultSiteContent,
    ...savedContent,
    hero: { ...defaultSiteContent.hero, ...savedContent?.hero },
    theme: { ...defaultSiteContent.theme, ...savedContent?.theme },
    features: defaultSiteContent.features.map((feature) => ({
      ...feature,
      ...(savedContent?.features?.find((item) => item.key === feature.key) || {}),
    })),
  }
}
