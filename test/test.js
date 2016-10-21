const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const path = require('path');

const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const after = lab.after;
const expect = Code.expect;

const {
  Runner
} = require('../');

describe('Runner', ()=>{
  const pluginsFolder = path.join(__dirname, 'plugins');
  it('can run a basic pipeline', (done)=>{
    const r = new Runner({pluginsFolder, baseDir: __dirname});
    r.run('configs/woot.js', (code, result)=>{
      expect(code).to.equal(0);
      expect(result).to.be.an.object().and.to.equal({status: 'Woot'});
      done();
    });
  });

  it('can run tasks from a single plugin within a pipeline', (done)=>{
    const r = new Runner({pluginsFolder, baseDir: __dirname});
    r.run('configs/multi.js', (code, result)=>{
      expect(code).to.equal(0);
      expect(result).to.be.an.object().and.to.equal({status: 'Foo Bar'});
      done();
    });
  });

  it('can run embedded tasks from a pipeline', (done)=>{
    const r = new Runner({pluginsFolder, baseDir: __dirname});
    r.run('configs/embedded.js', (code, result)=>{
      expect(code).to.equal(0);
      expect(result).to.be.an.object().and.to.equal({success: true});
      done();
    });
  });
});
