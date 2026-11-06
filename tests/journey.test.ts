import test from 'node:test';import assert from 'node:assert/strict';
import {remainingUnlockTime} from '../src/services/journey.ts';
test('blueprint unlock is tied to first access and opens exactly at 48 hours',()=>{const first=1700000000000;assert.equal(remainingUnlockTime(first,first,48),172800000);assert.equal(remainingUnlockTime(first,first+172799999,48),1);assert.equal(remainingUnlockTime(first,first+172800000,48),0);assert.equal(remainingUnlockTime(first,first+200000000,48),0);assert.equal(remainingUnlockTime(first,first,1),3600000)});
