const { getCulinaryKnowledge } = require('./src/lib/ai_service');

async function test() {
  console.log('--- Testing Knowledge Retrieval ---');
  // Try a topic I know was seeded (e.g., "Alcachofa")
  const topic = "Alcachofa";
  const result = await getCulinaryKnowledge(topic);
  
  if (result) {
    console.log('SUCCESS: Knowledge found for topic:', topic);
    console.log(result.slice(0, 500) + '...');
  } else {
    console.log('FAILED: No knowledge found for topic:', topic);
  }
}

test();
