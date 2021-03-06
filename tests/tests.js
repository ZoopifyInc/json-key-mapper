/* globals jkm, jkmMin, QUnit */
'use strict';
var runTests = function(title, jkm){

    QUnit.test(title + ': + PUBLIC (setter / getter)', function(assert){

        var mapA = {a: 'b'};
        var mapB = {z: 'd'};

        jkm.setMap('testA', {a: 'b'});
        jkm.setMap('testB', {z: 'd'});

        assert.propEqual(jkm.__private.getMap('testA'), mapA, 'getMap()');
        assert.propEqual(jkm.__private.getMap('testB'), mapB, 'getMap()');

    });

    QUnit.test(title + ': + PUBLIC (map with object map, not name of map)', function(assert){

        var testData = {c: 100};
        var testCase = {c: 100};

        assert.propEqual(jkm.map({a: 'b'}, testData), testCase, 'map() with object map not named map');
    });

    QUnit.test(title + ': + PUBLIC (swap properties and values)', function(assert){

        var testData = {
                        id: 'mapId',
                        school_id: 'schoolId',
                        name: 'positionName'
                    };

        var testCase = {
                        mapId: 'id',
                        schoolId: 'school_id',
                        positionName: 'name'
                    };

        assert.propEqual(jkm.swapPropVals(testData), testCase, 'swapKeys()');
    });

    QUnit.test(title + ': + PUBLIC (mapping implimentation)', function(assert){

        var testData, testCase;

        //------------------------------------------------------------------------------------

        jkm.setMap('test', {a: 'b'});
        testData = {c: 100};
        testCase = {c: 100};
        assert.propEqual(jkm.map('test', testData), testCase, 'map() item with no matching map keys');

        //------------------------------------------------------------------------------------

        jkm.setMap('test', {a: 'b'});
        testData = {a: 100};
        testCase = {b: 100};
        assert.propEqual(jkm.map('test', testData), testCase, 'map() item');

        //------------------------------------------------------------------------------------

        jkm.setMap('test', {a: 'b'});
        testData = [{a: 100}];
        testCase = [{b: 100}];
        assert.propEqual(jkm.map('test', testData), testCase, 'map() array');

        //------------------------------------------------------------------------------------

        jkm.setMap('test', {});
        testData = [{a: 100}];
        testCase = [{a: 100}];
        assert.propEqual(jkm.map('test', testData), testCase, 'map() with no mapping should return same object');

        //------------------------------------------------------------------------------------

        jkm.setMap('no name', {a: 'b'});
        testData = {a: 100};
        testCase = {a: 100};
        assert.propEqual(jkm.map('test', testData), testCase, 'map() item with no mapping should return the same object');

        //------------------------------------------------------------------------------------

        jkm.setMap('oneItem', {a: 'z'});
        testData = {a: 100, b: 200};
        testCase = {z: 100, b: 200};
        assert.propEqual(jkm.map('oneItem', testData), testCase, 'map() only one property, keep the rest');

        //------------------------------------------------------------------------------------

        jkm.setMap('oneItem', {a: 'z'});
        testData = {a: '', b: false};
        testCase = {z: '', b: false};
        assert.propEqual(jkm.map('oneItem', testData), testCase, 'map() property with falsy values');

        //------------------------------------------------------------------------------------

        jkm.setMap('manyFalsy', {a: 'z', b: 'y', d:'x'});
        testData = {a: false, b: null, c: NaN, d: 0, e: ''};
        testCase = {z: false, y: null, c: NaN, x: 0, e: ''};
        assert.propEqual(jkm.map('manyFalsy', testData), testCase, 'map() property with many falsy values');

        //------------------------------------------------------------------------------------

        jkm.setMap('conflictedMapping', {a: 'z'});
        testData = {a: 100, b: 200, z: 300};
        testCase = {z: 100, b: 200};
        assert.propEqual(jkm.map('conflictedMapping', testData), testCase, 'map() remove existing property if it conflicts with mapped version');
    });

    QUnit.test(title + ': + PUBLIC (nested mapping implimentation)', function(assert){

        var testMap = {
            a: 'z',
            b: {c: 'y'},
            d: 'x'
        };

        var testData = {
            a: 2,
            b: {c: 3},
            d: 4
        }

        var testCase = {
            z: 2,
            b: {y: 3},
            x: 4
        }

        jkm.setMap('nestedMap', testMap);
        assert.propEqual(jkm.map('nestedMap', testData), testCase, 'map() nested mapping one deep');

        //------------------------------------------------------------------------------------

        testMap = {
            a: 'aa',
            b: {c: 'cc',
                d: {b: 'bb',
                    g: 'gg'}
                },
            d: 'dd'
        };

        testData = {
            a: 1,
            b: {c: 2,
                d: {b: 3,
                    g: 4}
                },
            d: 5
        };

        testCase = {
            aa: 1,
            b: {cc: 2,
                d: {bb: 3,
                    gg: 4}
                },
            dd: 5
        };

        jkm.setMap('nestedMapTwo', testMap);
        assert.propEqual(jkm.map('nestedMapTwo', testData), testCase, 'map() nested mapping two deep');

    });

    QUnit.test(title + ': - PRIVATE (single object mapping)', function(assert){

        var testMap = {
                        id: 'mapId',
                        school_id: 'schoolId',
                        name: 'positionName'
                    };

        jkm.setMap('test', testMap);

        var testData = {
                        id: 12,
                        school_id: 'A',
                        name: 'test name'
                    };

        var testCase = {
                        mapId: 12,
                        schoolId: 'A',
                        positionName: 'test name'
                    };

        assert.propEqual(jkm.__private.mapItem(testData, testMap), testCase, 'mapItem()');

    });

    QUnit.test(title + ': - PRIVATE (array object mapping)', function(assert){

        var testMap = {
                        id: 'mapId',
                        school_id: 'schoolId',
                        name: 'positionName'
                    };

        var testData = [{
                        id: 12,
                        school_id: 'A',
                        name: 'test name'
                    },
                    {
                        id: 15,
                        school_id: 'B',
                        name: 'blah name'
                    }];

        var testCase = [{
                        mapId: 12,
                        schoolId: 'A',
                        positionName: 'test name'
                    },{
                        mapId: 15,
                        schoolId: 'B',
                        positionName: 'blah name'
                    }];

        assert.propEqual(jkm.__private.mapArray(testData, testMap), testCase, 'mapArray()');

    });
};


runTests('Unminified', jkm);
runTests('Minified', jkmMin);



