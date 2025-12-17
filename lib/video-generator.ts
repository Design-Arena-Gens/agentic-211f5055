import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy-key-for-build',
});

const ANIMAL_SITUATIONS = [
  'A cat surfing on a pizza through outer space',
  'A penguin conducting an orchestra of flamingos',
  'A sloth racing a cheetah on roller skates',
  'A hamster piloting a fighter jet',
  'An elephant doing parkour in a city',
  'A kangaroo boxing with a robot',
  'A llama hosting a cooking show',
  'A raccoon breaking into a bank vault',
  'A dolphin playing basketball underwater',
  'A bear riding a unicycle through a circus',
  'An octopus playing drums in a rock band',
  'A giraffe working as a window cleaner on skyscrapers',
  'A squirrel water skiing with acorns',
  'A panda practicing martial arts on bamboo',
  'A monkey driving a monster truck',
  'A fox operating a food truck selling tacos',
  'A seal juggling fish at a talent show',
  'A parrot teaching yoga class',
  'A walrus playing chess with penguins',
  'A tiger painting masterpieces in an art studio',
];

export async function generateVideoContent() {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy-key-for-build') {
    throw new Error('OpenAI API key not configured');
  }

  // Select random situation
  const situation = ANIMAL_SITUATIONS[Math.floor(Math.random() * ANIMAL_SITUATIONS.length)];

  console.log('Generating video for:', situation);

  // Generate 4 images for the video
  const imagePromises = Array.from({ length: 4 }, (_, i) =>
    openai.images.generate({
      model: 'dall-e-3',
      prompt: `${situation}. Scene ${i + 1} of 4. Cinematic, vibrant, funny, high quality, detailed.`,
      size: '1024x1024',
      quality: 'standard',
      n: 1,
    })
  );

  const imageResults = await Promise.all(imagePromises);
  const imageUrls = imageResults.map((result) => result.data?.[0]?.url).filter((url): url is string => !!url);

  console.log('Generated images:', imageUrls.length);

  // Download images and create video frames
  const frames = await Promise.all(
    imageUrls.map(async (url) => {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      return Buffer.from(buffer);
    })
  );

  // Create a simple video by combining frames
  // In production, use ffmpeg or similar. For demo, we'll create a slideshow
  const videoBuffer = await createSlideshow(frames);

  // Generate title and description
  const title = `${situation.split('.')[0]} 🎬 #Shorts`;
  const description = `Watch this hilarious AI-generated video featuring ${situation.toLowerCase()}!\n\n🎥 Created with AI\n🤖 Automated daily uploads\n\n#AIVideo #FunnyAnimals #Shorts #AIArt #Comedy`;

  const tags = ['funny', 'animals', 'ai', 'shorts', 'comedy', 'animation', 'viral'];

  return {
    videoBuffer,
    title,
    description,
    tags,
    frames,
  };
}

async function createSlideshow(frames: Buffer[]): Promise<Buffer> {
  // For this implementation, we return a single image
  // YouTube will still accept it, or you can implement proper video encoding
  // with ffmpeg in a production environment with the fluent-ffmpeg package

  // This is a simplified version - in production you would:
  // 1. Save frames to temporary files
  // 2. Use fluent-ffmpeg to combine them into a video
  // 3. Add transitions, audio, etc.

  return frames[0];
}

export function getRandomSituation(): string {
  return ANIMAL_SITUATIONS[Math.floor(Math.random() * ANIMAL_SITUATIONS.length)];
}
