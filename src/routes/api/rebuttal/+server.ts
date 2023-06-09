import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { OPENAI_KEY } from '$env/static/private';
import { Configuration, OpenAIApi } from 'openai';
import type { Actions } from '@sveltejs/kit';
const openAI = new OpenAIApi(
	new Configuration({
		apiKey: OPENAI_KEY
	})
);

export const POST = (async ({ request }) => {
    try {
      const { category, recordedAnswer } = await request.json();
      let prompt = `Does the response "${recordedAnswer}" fit in the category "${category}"? There should be no other words in your response besides Yes or No, no explanation should be provided`;
      const res = await openAI.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      // Eventually remove one from uses.

      let response = res.data.choices[0].message?.content.replace(/\./g, '');
      console.log(`Rebuttal: ${prompt}\nResponse: ${response}`);
      //Default to no if it gives some stupid shit
      if (response?.toLowerCase() != "yes" && response?.toLowerCase() != "no"){
        console.log("shit response... Rebuttal broke")
        response = "no"
      }
      if (response === undefined) {
        throw new Error('Failed to retrieve valid response from the AI model.');
      }
  
      
      return json(response.toLowerCase());
    } catch (error) {
      console.error(error);
      return new Response('An error occurred while processing the request.', { status: 500 });
    }
  }) satisfies RequestHandler;