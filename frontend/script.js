const fs = require('fs');

const hostStep2 = fs.readFileSync('src/pages/host/HostStep2.jsx', 'utf8');
const hostSetup = fs.readFileSync('src/pages/host/HostSetup.jsx', 'utf8');

// Extract the step 3 content from HostStep2.jsx
const startMarker = '{photos.length === 0 ? (';
const startIndex = hostStep2.indexOf(startMarker);
let endIndex = hostStep2.indexOf(')}', hostStep2.indexOf('</button>', hostStep2.indexOf('<button className={styles.deleteConfirmBtn}')));
endIndex += 2; // to include ')}'

let block = hostStep2.substring(startIndex, endIndex);

// Change styles. to step1Styles.
block = block.replace(/styles\./g, 'step1Styles.');
// Also change pendingPhotos to selectedUploadPhotos
block = block.replace(/pendingPhotos/g, 'selectedUploadPhotos');
// Change closeUploadModal to () => { setShowUploadModal(false); setSelectedUploadPhotos([]); }
block = block.replace(/closeUploadModal/g, '() => { setShowUploadModal(false); setSelectedUploadPhotos([]); }');
// Change handleUploadSubmit to () => { setIsUploading(true); setTimeout(() => { setPhotos([...photos, ...selectedUploadPhotos]); setSelectedUploadPhotos([]); setIsUploading(false); setShowUploadModal(false); }, 1500); }
block = block.replace(/handleUploadSubmit/g, '() => { setIsUploading(true); setTimeout(() => { setPhotos([...photos, ...selectedUploadPhotos]); setSelectedUploadPhotos([]); setIsUploading(false); setShowUploadModal(false); }, 1500); }');
// Change isUploadModalOpen to showUploadModal
block = block.replace(/isUploadModalOpen/g, 'showUploadModal');
// Change confirmDeletePhoto
block = block.replace(/confirmDeletePhoto/g, '() => { setPhotos(photos.filter((_, i) => i !== photoToDelete)); setPhotoToDelete(null); }');

// Change handleAddPhotosClick to () => setShowUploadModal(true)
block = block.replace(/handleAddPhotosClick/g, '() => setShowUploadModal(true)');

// Now we wrap it in the serviceStep 13 structure for HostSetup.jsx
const replacement = \              <div className={step1Styles.pageContainer} style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
                <div style={{ flexGrow: 1 }}>
                  \ + block + \
                </div>
                <footer className={styles.fixedFooter} style={{position: 'absolute', justifyContent: 'space-between', display: 'flex', alignItems: 'center'}}>
                  <span className={styles.getTipsText}>Get tips</span>
                  <button
                    className={\\\\\\ \\\\\\}
                    onClick={() => setServiceStep(14)}
                  >
                    Next
                  </button>
                </footer>\;

const replaceStart = hostSetup.indexOf('<div\\r\\n                className={styles.autoStyle1}\\r\\n              >');
const replaceEnd = hostSetup.indexOf(') : serviceStep === 12 ? (');

const newHostSetup = hostSetup.substring(0, replaceStart) + replacement + '\\r\\n              </div>\\r\\n            ' + hostSetup.substring(replaceEnd);

fs.writeFileSync('src/pages/host/HostSetup.jsx', newHostSetup);
console.log("DONE");
