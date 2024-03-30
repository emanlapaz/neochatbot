// VoiceOptionsData.ts

export interface VoiceOption {
  voice_id: string;
  name: string;
  labels: {
    accent: string;
    description: string;
    age: string;
    gender: string;
  };
}

export const getVoiceOptions = (): VoiceOption[] => {
  return [
    {
      voice_id: "EXAVITQu4vr4xnSDxMaL",
      name: "Sarah",
      labels: {
        accent: "American",
        description: "Soft",
        age: "Young",
        gender: "Female",
      },
    },
    {
      voice_id: "EGBv7mTt0atIp3Br8iCZE",
      name: "Thomas",
      labels: {
        accent: "American",
        description: "Calm",
        age: "Young",
        gender: "Male",
      },
    },
    {
      voice_id: "IKne3meq5aSn9XLyUdCD",
      name: "Charlie",
      labels: {
        accent: "Australian",
        description: "Casual",
        age: "Middle aged",
        gender: "Male",
      },
    },
    {
      voice_id: "LcfcDJNUP1GQjkzn1xUU",
      name: "Emily",
      labels: {
        accent: "American",
        description: "Calm",
        age: "Young",
        gender: "Female",
      },
    },
    {
      voice_id: "MF3mGyEYCl7XYWbV9V6O",
      name: "Elli",
      labels: {
        accent: "American",
        description: "Emotional",
        age: "Young",
        gender: "Female",
      },
    },
    {
      voice_id: "N2lVS1w4EtoT3dr4eOWO",
      name: "Callum",
      labels: {
        accent: "American",
        description: "Hoarse",
        age: "Middle aged",
        gender: "Male",
      },
    },
    {
      voice_id: "D38z5RcWu1voky8WS1ja",
      name: "Fin",
      labels: {
        accent: "Irish",
        description: "Sailor",
        age: "Old",
        gender: "Male",
      },
    },
    {
      voice_id: "JBFqnCBsd6RMkjVDRZzb",
      name: "George",
      labels: {
        accent: "british",
        description: "raspy",
        age: "middle aged",
        gender: "male",
      },
    },
  ];
};
