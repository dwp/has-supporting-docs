window.GOVUKPrototypeKit.documentReady(() => {
  // Add JavaScript here
// Autosave

if (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD) {
  window.location.reload();
}

window.addEventListener( "pageshow", function ( event ) {
  var historyTraversal = event.persisted || ( typeof window.performance != "undefined" && window.performance.navigation.type === 2 );
  if ( historyTraversal ) {
    window.location.reload();
  }
});

const currentUrl = window.location.href;
const pathsWithAutoSave = [
  'v8-htln-363',
  'v9-htln-416',
  'v10-htln-431',
  'v10-htln-431-NCAT',
  'v10-htln-491-mvp',
  'v10-htln-503-mvp-v2'
]
const isAutoSavePath = pathsWithAutoSave.some((el) => currentUrl.includes(el));
console.log(`Current url is ${currentUrl}. Is Auto save path? ${isAutoSavePath}`);

if(isAutoSavePath) {
  document.querySelectorAll('input, textarea').forEach((el) => {
    if(!el.classList.contains('autosave')) {
      el.classList.add('autosave')
    }
  });

  document.querySelectorAll('.autosave').forEach((element) => {
    element.addEventListener('focusout', autosave);
    element.addEventListener('change', autosave);
    element.addEventListener('keyup', autosave);
  });
}

async function autosave(el) {
  let field;
  let value;
  if (el.currentTarget?.type === 'checkbox') {
    field = el.currentTarget.name;
    value = Array.from(document.getElementsByName(el.currentTarget.name)).filter(x => x.checked).map(x => x.value);
  } else {
    field = el.currentTarget?.name || el.name;
    value = el.currentTarget?.value || el.value;
  }
  return fetch('/autosave', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ field, value }),
  })
    .then((response) => response.json())
    .then((data) => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
}


// // document filters
function countDocumentTypes() {
  const importantDocsAmount = Array.from(document.querySelectorAll('strong')).filter((x) => x.innerText === 'IMPORTANT').length;
  document.querySelectorAll('#importantCount1').forEach((element) => element.innerText = importantDocsAmount);

  const unreadDocsAmount = Array.from(document.querySelectorAll('strong')).filter((x) => x.innerText === 'UNREAD').length;
  document.querySelectorAll('#unreadCount1').forEach((element) => element.innerText = unreadDocsAmount);

  const archivedDocsAmount = Array.from(document.querySelectorAll('strong')).filter((x) => x.innerText === 'ARCHIVED').length;
  document.querySelectorAll('#archivedCount1').forEach((element) => element.innerText = archivedDocsAmount);
}






// document filters
  // function countDocumentTypes() {
  //   const importantDocsAmount = Array.from(document.querySelectorAll('strong')).filter((x) => x.innerText === 'IMPORTANT').length;
  //   document.querySelectorAll('#importantCount').forEach((element) => element.innerText = importantDocsAmount);
  
  //   const unreadDocsAmount = Array.from(document.querySelectorAll('strong')).filter((x) => x.innerText === 'UNREAD').length;
  //   document.querySelectorAll('#unreadCount').forEach((element) => element.innerText = unreadDocsAmount);

  //   const archivedDocsAmount = Array.from(document.querySelectorAll('strong')).filter((x) => x.innerText === 'ARCHIVED').length;
  //   document.querySelectorAll('#archivedCount').forEach((element) => element.innerText = archivedDocsAmount);
  // }

  function clearFilters(evt) {
    evt.preventDefault();
    document.querySelectorAll("[id^='benefitType']:checked, [id^='documentLabel']:checked").forEach(el => el.checked = false);
    document.getElementById('applyFilters').click();
  }

  function filterDocuments(evt) {
    evt?.preventDefault();
    document.querySelectorAll('.filter-table-row').forEach((row) => row.style.display = 'table-row');
    const benefitTypes = Array.from(document.querySelectorAll("[id^='benefitType']:checked")).map((e) => e.value);
    const labels = Array.from(document.querySelectorAll("[id^='documentLabel']:checked")).map((e) => e.value);
    if(!benefitTypes.length && !labels.length) {
      return;
    }
      document.querySelectorAll('.filter-table-row').forEach((row) => {
          let toDisplayBenefitType = false;
          let toDisplayLabel = false;
          row.childNodes.forEach((child) => {
            if(benefitTypes.includes(child.innerText)) {
              toDisplayBenefitType = true;
            }
            child.childNodes.forEach((grandchild) => {
              if(labels.includes(grandchild.innerText)) {
                toDisplayLabel = true;
              }
            });
          });
          if(benefitTypes.length && labels.length) {
            row.style.display = toDisplayBenefitType && toDisplayLabel ? 'table-row' : 'none';
          } else {
            row.style.display = toDisplayBenefitType || toDisplayLabel ? 'table-row' : 'none';
          }
      });
  }

  function isVisible(el) {
    return !!( el.offsetWidth || el.offsetHeight || el.getClientRects().length );
  }

  async function countDocsForDisplay(e) {
    e.preventDefault();
    const totalValueInput =  document.getElementById("totalDocuments");
    const currentValueInput = document.getElementById("selectedDocument");
    const current = Array.from(document.querySelectorAll('.selectDocumentLink')).filter((x) => isVisible(x)).indexOf(e.target) + 1;
    const total = Array.from(document.querySelectorAll('.filter-table-row')).filter((x) => isVisible(x)).length;
    totalValueInput.value = total;
    currentValueInput.value = current || 1;
    await autosave(totalValueInput);
    await autosave(currentValueInput);
    window.location.href = e.target.href;
  }

  async function updateCurrentDocNumber(e) {
    e.preventDefault();
    console.log(e);
    const currentDoc = parseInt(document.getElementById('docAmountSpan').innerText.replace(/ .*/,''));
    console.log(currentDoc);
    await autosave({name: 'selectedDocument', value: e.target.rel === 'prev' ? currentDoc - 1 : currentDoc + 1});
    if(e.target.href) {
      window.location.href = e.target.href;
    } else {
      document.getElementsByClassName('form')[0].submit();
    }
  }

  countDocumentTypes();
  filterDocuments();
  
  if(document.getElementById("applyFilters")) {
    document.getElementById("applyFilters").addEventListener("click", filterDocuments);
  }

  if(document.getElementById("clearFilters")) {
    document.getElementById("clearFilters").addEventListener("click", clearFilters);
  }

  document.querySelectorAll("input[name$='Read']").forEach((element) => {
    autosave(element);
  });

  document.querySelectorAll('.selectDocumentLink, .linearJourneyLink').forEach((el) => el.addEventListener('click', countDocsForDisplay));

  document.querySelectorAll('.govuk-link.govuk-pagination__link, .linear-next-document-button').forEach((el) => el.addEventListener('click', updateCurrentDocNumber));
});


window.$ = $