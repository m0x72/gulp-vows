  var APIeasy = require('api-easy');//,
      // assert = require('assert');

  var suite = APIeasy.describe('your/awesome/api - json.spec.js');

  suite.discuss('When using your awesome API')
      .use('echo.jsontest.com/', 80)
      .setHeader('Content-Type', 'application/json')
      .discuss('and your awesome resource')
      .get('key/value/key2/value2')
      .expect(200, { key: 'value', key2: 'value2' })
      .undiscuss().unpath()
      .discuss('resource 2')
      .get('key/value/key2/value2')
      .expect(200, { key: 'value', key2: 'value2' })
      .undiscuss().unpath()
      .discuss('resource 3')
      .get('key/value/key2/value2')
      .expect(200, { key: 'value', key2: 'value2' })
      .undiscuss().unpath()
      .discuss('resource 4')
      .get('key/value/key2/value2')
      .expect(200, { key: 'value', key2: 'value2' })

        .discuss('rousource 4.1')
        .get('key3/value3')
        .expect(200, { key3: 'value3'})

          .discuss('resource 4.1.1')
          .get('key4/value4')
          .expect(200, { key4: 'value4'})
          .undiscuss()

        .undiscuss()

      .undiscuss().unpath()
      .discuss('resource 5')
      .get('key/value/key2/value2')
      .expect(200, { key: 'value', key2: 'value2' })
      .undiscuss().unpath()
      .discuss('resource 6')
      .get('key/value/key2/value2')
      .expect(200, { key: 'value', key2: 'value2' })
      .undiscuss().unpath()
      .discuss('resource 7')
      .get('key/value/key2/value2')
      .expect(200, { key: 'value', key2: 'value2' })
      .undiscuss().unpath()
      .discuss('resource 8')
      .get('key/value/key2/value2')
      .expect(200, { key: 'value', key2: 'value2' })
      .undiscuss().unpath()
      .discuss('resource 9')
      .get('key/value/key2/value2')
      .expect(200, { key: 'value', key2: 'value2' })
      .export(module);