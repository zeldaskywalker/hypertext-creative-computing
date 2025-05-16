// parse date and format as desired. example:
// Friday, May 16, 2025 at 11:40 AM.
export function dateParser(strDate) {
  const full_date = new Date(strDate);
  const weekday_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const month_names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const final_day_of_week = weekday_names[full_date.getDay()];
  const final_month = month_names[full_date.getMonth()];
  const final_day = full_date.getDate();
  const final_year = full_date.getFullYear();
  const time = full_date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

  const formatted_date = `${final_day_of_week}, ${final_month} ${final_day}, ${final_year} at ${time}`;
  return formatted_date;
}

export function handleMobileOrResize() {
  const overall_container = document.querySelector('#overall');
  const invalid_width_container = document.querySelector('#not-wide-enough');
  if (window.innerWidth < 1035) {
    overall_container.style.display = 'none';
    invalid_width_container.style.display = 'flex';
  } else if (window.innerWidth >= 1035) {
    overall_container.style.display = 'flex';
    invalid_width_container.style.display = 'none';
  }
}

// do not open info modal automatically if it has been within 24 hours of showing
export function checkInfoModalStatus() {
  const now = new Date();
  const now_ms = now.getTime();
  const modalOpened = localStorage.getItem('modalOpened');
  const expiration = localStorage.getItem('expiration');

  if (!modalOpened) {
    const one_day_ms = 86400000;
    localStorage.setItem('modalOpened', true);
    localStorage.setItem('expiration', now_ms + one_day_ms);
    openInfo();
  } else {
    if (now_ms > expiration) {
      localStorage.removeItem('modalOpened');
      localStorage.removeItem('expiration');
    }
  }
}