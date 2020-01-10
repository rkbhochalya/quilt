import {readJSONSync} from 'fs-extra';
import {join, resolve} from 'path';
import glob from 'glob';

const packages = readPackages()
// Ensure consistency with packages, and with template
packages.push(readTemplate());

packages.forEach(({packageName, packageJSON, packageJSONPath}) => {
  describe(packageJSONPath, () => {
    it('specifies Shopify as author', () => {
      expect(packageJSON.author).toBe('Shopify Inc.');
    });

    it('specifies Quilt Issues as bugs URL', () => {
      expect(packageJSON.bugs).toEqual({
        url: 'https://github.com/Shopify/quilt/issues',
      });
    });

    it('specifies a description', () => {
      expect(packageJSON.description).not.toBeUndefined();
    });

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
    .map((absolutePackageJSONPath) => {
      const packageName = absolutePackageJSONPath.slice(packageStartIndex, packageEndIndex);
      const packageJSON = readJSONSync(absolutePackageJSONPath);
      const packageJSONPath = absolutePackageJSONPath.replace(packagesPath, 'packages');

      return {
        packageName,
        packageJSON,
        packageJSONPath,
      };
    });
}

function readTemplate()  {
  const packageJSONPath = join('templates', 'package.hbs.json');
  const absolutePackageJSONPath = resolve(__dirname, '..', packageJSONPath);

  return {
    packageName: '{{name}}',
    packageJSON: readJSONSync(absolutePackageJSONPath),
    packageJSONPath,
  }
}
