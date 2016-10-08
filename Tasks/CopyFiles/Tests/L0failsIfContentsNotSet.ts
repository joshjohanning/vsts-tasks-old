	// // it('fails if Contents not set', (done) => {
	// // 	setResponseFile('copyFilesAllGood.json');
		
	// // 	var tr = new trm.TaskRunner('CopyFiles');
	// // 	tr.setInput('SourceFolder', '/srcDir');
	// // 	tr.setInput('TargetFolder', '/destDir');
	// // 	tr.run()
	// // 	.then(() => {
	// // 		assert(tr.resultWasSet, 'task should have set a result');
	// // 		assert(tr.stderr.length > 0, 'should have written to stderr');
	// // 		assert(tr.stdErrContained('Input required: Contents'));
    // //         assert(tr.failed, 'task should have failed');
    // //         assert(tr.invokedToolCount == 0, 'should exit before running CopyFiles');
	// // 		done();
	// // 	})
	// // 	.fail((err) => {
	// // 		done(err);
	// // 	});
	// // })

import fs = require('fs');
import mockanswer = require('vsts-task-lib/mock-answer');
import mockrun = require('vsts-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'copyfiles.js');
let runner: mockrun.TaskMockRunner = new mockrun.TaskMockRunner(taskPath);
runner.setInput('SourceFolder', '/srcDir');
runner.setInput('TargetFolder', '/destDir');
runner.setInput('CleanTargetFolder', 'false');
runner.setInput('Overwrite', 'false');
let answers = <mockanswer.TaskLibAnswers> {
    checkPath: {
        '/srcDir': true
    }
}
runner.setAnswers(answers);

// as a precaution, disable fs.chmodSync. it is the only fs function
// called by copyfiles and should not be called during this scenario.
fs.chmodSync = null;
runner.registerMock('fs', fs);

runner.run();
