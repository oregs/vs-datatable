export const noDataSVG = (identity: number | string, message: string = "") => {
    return `
      <svg width="60pt" height="60pt" id="Layer__${identity}" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 70 70">
          <defs>
              <linearGradient id="no-data__rfq_${identity}" x1="40.1" y1="64.17" x2="40.1" y2="5.83" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stop-color="#969698" stop-opacity="0.1" />
                  <stop offset="1" stop-color="#869ac0" stop-opacity="0.25" />
              </linearGradient>
              <linearGradient id="no-data__rfq-2_${identity}" x1="176.51" y1="-169.09" x2="196.67" y2="-169.09" gradientTransform="matrix(0.73, 0, 0, -0.73, -125.67, -73.17)" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stop-color="#969698" />
                  <stop offset="1" stop-color="#869ac0" />
              </linearGradient>
              <linearGradient id="no-data__rfq-3_${identity}" x1="187.34" y1="-148.34" x2="227.34" y2="-148.34" xlink:href="#no-data__rfq-2_${identity}" />
          </defs>
          <path d="M61.25,20.42H46.67V5.83Z" fill="#929aa5" opacity="0.5" style="isolation:isolate" />
          <path d="M19,5.83H46.67L61.25,20.42V64.17H19ZM54,27H26.25V29.9H54Zm0,6.56H26.25v2.92H54ZM26.25,40.1H54V43H26.25Zm0,6.57H54v2.91H26.25Z" fill-rule="evenodd" fill="url(#no-data__rfq_${identity})" />
          <path d="M3,53.35,13.62,42.78l4.12,4.13L7.17,57.48,3,53.35Z" fill-rule="evenodd" fill="url(#no-data__rfq-2_${identity})" />
          <path d="M37.19,35A11.67,11.67,0,1,0,25.52,46.67,11.68,11.68,0,0,0,37.19,35Zm2.91,0A14.58,14.58,0,1,0,25.52,49.58,14.58,14.58,0,0,0,40.1,35Z" fill-rule="evenodd" fill="url(#no-data__rfq-3_${identity})" />
      </svg>
      <div class="fs-5 fw-700 text-fmdqgray">${message}</div>
    `;
  }