import {readJSONSync} from 'fs-extra';
import {join, resolve} from 'path';
import glob from 'glob';

const packages = readPackages();

packages.forEach(({packageName, packageJSON}) => {
  describe(`${packageName}'s package.json`, () => {
    it('specifies name matching scope and path', () => {
      expect(packageJSON.name).toBe(`@shopify/${packageName}`);
    });
  });
});

function readPackages() {
  const packagesPath = resolve(__dirname, '..', 'packages');
  const packageStartIndex = 1 + packagesPath.length;
  const packageEndIndex = -1 - 'package.json'.length;

  return glob
    .sync(join(packagesPath, '*', 'package.json'))
    .map((packageJSONPath) => {
      const packageName = packageJSONPath.slice(packageStartIndex, packageEndIndex);
      const packageJSON = readJSONSync(packageJSONPath);

      return {packageName, packageJSON};
    });
}
