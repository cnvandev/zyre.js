/*
 * Copyright (c) 2017 Sebastian Rager
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

const assert = require('chai').assert;
const uuid = require('uuid');
const ZyrePeer = require('../lib/zyre_peer');

describe('ZyrePeer', () => {
  it('should create an instance of ZyrePeer', () => {
    const zyrePeer = new ZyrePeer({
      identity: '12345',
    });

    assert.instanceOf(zyrePeer, ZyrePeer);
  });

  it('should mark an evasive peer', (done) => {
    const evasive = 200;
    const expired = 400;

    const identity = Buffer.alloc(16);
    uuid.v4(null, identity, 0);

    const zyrePeer = new ZyrePeer({
      identity: '12345',
      originID: identity,
      evasive,
      expired,
    });

    zyrePeer.update({
      sequence: 1,
    });

    setTimeout(() => {
      zyrePeer._clearTimeouts();
      if (zyrePeer._evasiveAt > 0) done();
    }, evasive + 100);
  });

  it('should mark an expired peer', (done) => {
    const evasive = 200;
    const expired = 400;

    const identity = Buffer.alloc(16);
    uuid.v4(null, identity, 0);

    const zyrePeer = new ZyrePeer({
      identity: '12345',
      originID: identity,
      evasive,
      expired,
    });

    zyrePeer.update({
      sequence: 1,
    });

    zyrePeer.on('expired', () => {
      done();
    });
  });
});
