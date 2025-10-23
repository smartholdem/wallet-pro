import { ref } from 'vue';
import { compare } from 'semver';

// Updated global declarations
declare global {
    interface Window {
        cordova: any;
        resolveLocalFileSystemURL: any; // For cordova-plugin-file
    }
    interface Navigator {
        notification: any; // For cordova-plugin-dialogs
    }
}

// Define types for clarity
interface VersionInfo {
  version: string;
  url: string;
}

// Reactive state
const updateInfo = ref<VersionInfo | null>(null);
const isUpdateAvailable = ref(false);
const downloadProgress = ref(0);
const isDownloading = ref(false);
const downloadError = ref('');

export function useUpdater() {
  const versionUrl = 'https://wallet.sth.cx/releases/version.json';

  const getCurrentAppVersion = (): Promise<string> => {
    return new Promise((resolve) => {
        if (window.cordova && window.cordova.getAppVersion) {
          console.log('Cordova getAppVersion plugin found.');
          window.cordova.getAppVersion.getVersionNumber().then((version: string) => {
            console.log('App version from plugin:', version);
            resolve(version);
          }).catch((err: any) => {
            console.error('getAppVersion failed:', err);
            resolve('0.0.0');
          });
        } else {
          console.log('Cordova getAppVersion plugin NOT found, falling back to env var.');
          resolve(import.meta.env.VITE_APP_VERSION || '0.0.0');
        }
    });
  };

  const checkForUpdate = async () => {
    console.log('Checking for update from:', versionUrl);
    if (window.cordova && window.cordova.plugin && window.cordova.plugin.http) {
        console.log('Using cordova-plugin-advanced-http...');
        window.cordova.plugin.http.get(versionUrl, {}, {}, async (response: any) => {
          try {
            console.log('Update check successful. Response status:', response.status);
            const versionData = JSON.parse(response.data);
            console.log('Parsed version data:', versionData);
            const latestVersionInfo = versionData.android;

            if (!latestVersionInfo || !latestVersionInfo.version) {
              console.error('No Android update info found in server response.');
              return;
            }
            console.log('Latest version on server:', latestVersionInfo.version);

            const currentVersion = await getCurrentAppVersion();
            console.log(`Comparing versions: Current='${currentVersion}', Latest='${latestVersionInfo.version}'`);
            
            const comparisonResult = compare(latestVersionInfo.version, currentVersion);
            console.log('Semver comparison result:', comparisonResult);

            if (comparisonResult > 0) {
              console.log('Newer version found! Setting isUpdateAvailable to true.');
              isUpdateAvailable.value = true;
              updateInfo.value = latestVersionInfo;
            } else {
              console.log('App is up to date.');
            }
          } catch (e) {
            console.error('Failed to parse or process update data:', e);
          }
        }, (response: any) => {
          console.error('Update check HTTP request failed:', response.error);
        });
      } else {
        console.error('cordova-plugin-advanced-http not found. Cannot check for updates.');
      }
  };

  const initUpdateCheck = () => {
      document.addEventListener('deviceready', checkForUpdate, false);
  };

  const downloadAndInstall = () => {
      if (!updateInfo.value) {
        downloadError.value = 'Update information is missing.';
        return;
      }

      isDownloading.value = true;
      downloadProgress.value = 0;
      downloadError.value = '';

      const fileURL = updateInfo.value.url;
      const fileName = fileURL.substring(fileURL.lastIndexOf('/') + 1);
      const targetPath = window.cordova.file.externalDataDirectory + fileName;

      console.log(`Starting download of ${fileURL} to ${targetPath}`);

      window.cordova.plugin.http.downloadFile(fileURL, {}, {}, targetPath, (entry: any) => {
        console.log('Download complete:', entry.fullPath);
        isDownloading.value = false;
        
        window.cordova.plugins.fileOpener2.open(
          entry.nativeURL,
          'application/vnd.android.package-archive',
          {
            error: (e: any) => {
              console.error('Error opening file', e);
              downloadError.value = 'Could not open update file. Please install it manually.';
            },
            success: () => console.log('File open success'),
          }
        );
      }, (response: any) => {
        console.error('Download failed:', response.error);
        downloadError.value = 'Failed to download the update.';
        isDownloading.value = false;
      });
  };

  return {
    initUpdateCheck,
    isUpdateAvailable,
    updateInfo,
    downloadAndInstall,
    isDownloading,
    downloadProgress,
    downloadError
  };
}