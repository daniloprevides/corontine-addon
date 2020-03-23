export const addonService = {
  getInfo: async (addonUrl, plugins, getList) => {
    return new Promise(async (resolve, reject) => {
      //getting plugin data
      const authPlugin = plugins.find(p => p.pluginType === "AUTH");
      const url = `${addonUrl}?callback_uri=${authPlugin.apiUrl}`;

      const data = await getList(
        url
      );
      resolve(data);
    });
  },
  createClientCredential: async (clientCredential, plugins,create) => {
    return new Promise(async (resolve, reject) => {
      //getting plugin data
      const authPlugin = plugins.find(p => p.pluginType === "AUTH");
      const url = `${authPlugin.apiUrl}/api/v1/credentials/generate/new`;

      const data = await create(
        clientCredential,
        url
      );

      resolve(data);
    });
  },
  setInformation: async (addonUrl, addonData, update) => {
    return new Promise(async (resolve, reject) => {
      const url = `${addonUrl}`;

      const data = await update(
        addonData,
        url
      );

      resolve(data);
    });
  },
};
