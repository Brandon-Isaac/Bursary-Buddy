'use server';

/**
 * @fileOverview This file defines a Genkit flow for matching students with suitable bursaries.
 *
 * It exports:
 * - `matchBursaries`: An asynchronous function that takes student data and returns a list of recommended bursaries.
 * - `MatchBursariesInput`: The input type for the `matchBursaries` function.
 * - `MatchBursariesOutput`: The output type for the `matchBursaries` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MatchBursariesInputSchema = z.object({
  profile: z
    .string()
    .describe('Student profile including personal details, academic record, and financial need.'),
  bursaryList: z.string().describe('A list of available bursaries with their descriptions and requirements.'),
});
export type MatchBursariesInput = z.infer<typeof MatchBursariesInputSchema>;

const MatchBursariesOutputSchema = z.object({
  recommendedBursaries: z
    .array(z.string())
    .describe('A list of bursaries recommended for the student based on their profile.'),
});
export type MatchBursariesOutput = z.infer<typeof MatchBursariesOutputSchema>;

export async function matchBursaries(input: MatchBursariesInput): Promise<MatchBursariesOutput> {
  return matchBursariesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'matchBursariesPrompt',
  input: {schema: MatchBursariesInputSchema},
  output: {schema: MatchBursariesOutputSchema},
  prompt: `You are an AI assistant that specializes in matching students with bursaries.

  Given the following student profile:
  {{profile}}

  And the following list of bursaries:
  {{bursaryList}}

  Recommend bursaries that the student is likely to be eligible for.
  Return a list of bursaries that match the student's profile, academic record, and financial need.
  Make sure to only recommend bursaries for which the student meets ALL requirements. Consider all aspects of the student's profile when recommending bursaries.
  Be strict about eligibility.
  `,
});

const matchBursariesFlow = ai.defineFlow(
  {
    name: 'matchBursariesFlow',
    inputSchema: MatchBursariesInputSchema,
    outputSchema: MatchBursariesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
