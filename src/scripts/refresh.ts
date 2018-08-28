import { refreshResource } from '../apis';
import { askDirOrUrl } from '../utils/ask';

export const refresh = async () => {
  const { useDir, value } = await askDirOrUrl();
  if (useDir) {
    await refreshResource({
      dirs: [value]
    })
  } else {
    await refreshResource({
      urls: [value]
    })
  }
}
