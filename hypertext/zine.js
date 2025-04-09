function handleMobileOrResize() {
  console.log('resizing...');
  const zineContainer = document.querySelector('#overall-zine-container');
  const mobileContainer = document.querySelector('#mobile');
  if (window.innerWidth < 690) {
    zineContainer.style.display = 'none';
    mobileContainer.style.display = 'flex';
    mobileContainer.style.padding = '20px';
    mobileContainer.style.margin = 'auto';
  } else if (window.innerWidth >= 690) {
    zineContainer.style.display = 'flex';
    mobileContainer.style.display = 'none';
  }
}

handleMobileOrResize();

window.onresize = handleMobileOrResize;