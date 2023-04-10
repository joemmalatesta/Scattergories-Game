import { OPENAI_KEY } from '$env/static/private';
import { Configuration, OpenAIApi } from 'openai';
import type { Actions } from '@sveltejs/kit';
const openAI = new OpenAIApi( new Configuration({
      apiKey: OPENAI_KEY
    }))

export const actions: Actions = {
	default: async (event) => {
		const formData = Object.fromEntries(await event.request.formData());
		const dataArray = Object.entries(formData).map(([index, value]) => ({ index, value }));
    

		// Sort the array of objects by index in ascending order
		dataArray.sort((a, b) => Number(a.index) - Number(b.index));

		// Remove the letter object from the array and get its value
		const letterIndex = dataArray.findIndex(({ index }) => index === 'letter');
		const [letterObject] = dataArray.splice(letterIndex, 1);
		const letter = letterObject?.value; // Use optional chaining in case letterObject is undefined


    console.log(dataArray)
		// Display the formatted data in the console
		let useableData = dataArray
  .map(({ index, value }) => `${index}: ${value ? value : 'ZYZYAQJIX'}`)
  .join('\n');
		let prompt = `Welcome to Scattergories! You are the judge, and your task is to determine whether the player's responses match the category and start with the selected letter.
		If the response is a valid match, please respond with a "Yes." If the response does not match, please respond with a "No."
		 Please ensure that responses are not overly-vague or manipulated by unjust use of adjectives.

		Here are the 12 categories and answers for a player with the letter "${letter}":
		${useableData}

		The input will be given as "Number : Category: Answer" Keep in mind answers can be blank and should be marked as "No" if they are
		Your response should follow this guideline:

		Yes/No
		Yes/No
		Yes/No
		Yes/No
		Yes/No
		Yes/No
		Yes/No
		Yes/No
		Yes/No
		Yes/No
		Yes/No
		Yes/No

		There should be no other words than yes or no. No explanation, no filling in the blanks, nothing more than 12 simple Yes or No's`

    const res = await openAI.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "user",
        content: prompt
      }]
    })

    const output = res.data.choices[0].message?.content
    console.log(res.data.choices)
    console.log(useableData)
    console.log(output)

    return {
      message: output
    }
	}
};
