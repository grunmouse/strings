const assert = require('assert');
const {
	recursiveSplit,
	recursiveJoin,
	splitWords,
	smallize,
	capitalize,
	optionalCapitalize
} = require('../index.js');


describe('@grunmouse/strings', ()=>{
	describe('capitalize', ()=>{
		it('exists', ()=>{
			assert.ok(typeof capitalize === 'function');
		});
		it('work', ()=>{
			assert.equal(capitalize('word'), 'Word');
			assert.equal(capitalize('camelCase'), 'CamelCase');
			assert.equal(capitalize('$symbol'), '$symbol');
			assert.equal(capitalize('Classize'), 'Classize');
		});
	});
	describe('optionalCapitalize', ()=>{
		it('exists', ()=>{
			assert.ok(typeof optionalCapitalize === 'function');
		});
		it('work', ()=>{
			assert.equal(optionalCapitalize('word'), 'Word');
			assert.equal(optionalCapitalize('word',0), 'word');
			assert.equal(optionalCapitalize('word',1), 'Word');
		});
	});
	describe('smallize', ()=>{
		it('exists', ()=>{
			assert.ok(typeof smallize === 'function');
		});
		it('work', ()=>{
			assert.equal(smallize('Word'), 'word');
			assert.equal(smallize('CamelCase'), 'camelCase');
			assert.equal(smallize('$symbol'), '$symbol');
			assert.equal(smallize('lower'), 'lower');
		});
		
	});
	describe('splitWords', ()=>{
		it('exists', ()=>{
			assert.ok(typeof splitWords === 'function');
		});
		it('split UpperCamelCase', ()=>{
			assert.deepEqual(splitWords('UpperCamelCase'), ['Upper','Camel','Case']);
		});
		it('split lowerCamelCase', ()=>{
			assert.deepEqual(splitWords('lowerCamelCase'), ['lower','Camel','Case']);
		});
		it('split lowerCamelCaseWithABBR', ()=>{
			assert.deepEqual(splitWords('lowerCamelCaseWithABBR'), ['lower','Camel','Case', 'With', 'ABBR']);
		});
		it('split ABBRWithCamelCase', ()=>{
			assert.deepEqual(splitWords('ABBRWithCamelCase'), ['ABBR', 'With', 'Camel','Case']);
		});
		
	});
	describe('recursiveSplit', ()=>{
		it('exists', ()=>{
			assert.ok(typeof recursiveSplit === 'function');
		});
		it('simple split', ()=>{
			assert.deepEqual(recursiveSplit('kebab-case-sample', ['-']), ['kebab', 'case', 'sample']);
		});
		it('two level split', ()=>{
			assert.deepEqual(recursiveSplit('dir/subdir-name/file-name', ['/','-']), [['dir'],['subdir','name'], ['file','name']]);
		});
		it('two level with callback', ()=>{
			assert.deepEqual(recursiveSplit('dir/subdir-name/file-name', ['/','-'], capitalize), 
				[
					['Dir'],
					['Subdir','Name'], 
					['File','Name']
				]
			);
		});
	});
	describe('recursiveJoin', ()=>{
		it('exists', ()=>{
			assert.ok(typeof recursiveJoin === 'function');
		});
		it('simple join', ()=>{
			assert.deepEqual(recursiveJoin(['kebab', 'case', 'sample'], ['-']), 'kebab-case-sample');
		});
		it('two level join', ()=>{
			assert.deepEqual(recursiveJoin([['dir'],['subdir','name'], ['file','name']], ['/','-']), 'dir/subdir-name/file-name');
		});
		it('two level with callback', ()=>{
			assert.deepEqual(recursiveJoin(
				[
					['Dir'],
					['Subdir','Name'], 
					['File','Name']
				], 
				['/','-'], smallize), 
				
				'dir/subdir-name/file-name'
			);
		});

	});
	describe('convert cases', ()=>{
		function itCase(source, result, fun){
			it([source,result].map(JSON.stringify).join(' -> '), ()=>{
				assert.equal(fun(source), result);
			});
		}
		
		itCase('one_two', 'oneTwo', (str)=>(recursiveJoin(recursiveSplit(str, ['_']), [''], optionalCapitalize)));
		itCase('one_two', 'One Two', (str)=>(recursiveJoin(recursiveSplit(str, ['_']), [' '], capitalize)));
		itCase('OneTwo', 'one_two', (str)=>(recursiveJoin(splitWords(str), ['_'], smallize)));
		itCase('dir/subdir-name/file-name', 'dir_subdirName_fileName', 
			(str)=>(recursiveJoin(recursiveSplit(str, ['/','-']), ['_', ''], optionalCapitalize))
		);
		itCase('dir_subdirName_fileName', 'dir/subdir-name/file-name', 
			(str)=>(recursiveJoin(recursiveSplit(str, ['_'], splitWords), ['/', '-'], smallize))
		);
	});
});