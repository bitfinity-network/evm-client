import { Base } from '../src/bridge-clients/chain';


const bridge = Bridge();
import dotenv from 'dotenv';
dotenv.config();
console.log(process.env.canister_ids_json);

test('adds 1 + 2 to equal 3', async () => {
  expect(sum(1, 2)).toBe(3);
});

test('adds 5 + 7 to equal 12', () => {
  expect(sum(5, 7)).toBe(12);
});