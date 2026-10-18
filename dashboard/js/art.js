/* Line-art equipment drawings for value-chain plates, keyed by the `icon` name
   used in data.js. Drawn in a 120x90 box, ground line at y=80.
   Classes: ln = ink line, fl = plate fill + ink, hl = signal fill + ink. */
window.ART = {
  turbine: `
    <path class="ln" d="M55 46V22H30V12M68 46V30h18"/>
    <path class="fl" d="M18 70l12-24h46l20-12v36z"/>
    <path class="ln" d="M44 46v24M58 46v24M72 46v24M84 39v31"/>
    <line class="ln" x1="6" y1="58" x2="114" y2="58"/>
    <rect class="hl" x="14" y="70" width="88" height="8"/>`,
  boiler: `
    <rect class="fl" x="30" y="24" width="44" height="54"/>
    <rect class="fl" x="34" y="14" width="36" height="10" rx="5"/>
    <path class="ln" d="M38 30v34M44 30v34M50 30v34M56 30v34M62 30v34M68 30v34"/>
    <rect class="fl" x="84" y="6" width="12" height="72"/>
    <rect class="hl" x="84" y="12" width="12" height="7"/>
    <path class="ln" d="M74 40h10"/>
    <path class="hl" d="M44 76c2-10 7-12 8-18 4 6 8 9 8 18z"/>`,
  genset: `
    <rect class="fl" x="12" y="32" width="96" height="42"/>
    <path class="ln" d="M20 40v26M25 40v26M30 40v26M35 40v26M40 40v26"/>
    <rect class="fl" x="88" y="16" width="8" height="16"/>
    <circle class="hl" cx="72" cy="53" r="12"/>
    <path class="ln" d="M74 45l-5 9h6l-5 9"/>
    <rect class="hl" x="8" y="74" width="104" height="5"/>`,
  tower: `
    <path class="ln" d="M0 31q15 7 28-4M92 27q15 11 28 4M0 47q17 6 34-6M86 41q17 12 34 6"/>
    <path class="ln" d="M60 4L42 78M60 4l18 74M28 22h64M34 36h52M47 52h26M45 64h30M42 78l33-14M78 78L45 64M47 52l39-16M73 52L34 36"/>
    <rect class="hl" x="27" y="22" width="3" height="7"/><rect class="hl" x="90" y="22" width="3" height="7"/>
    <rect class="hl" x="33" y="36" width="3" height="7"/><rect class="hl" x="84" y="36" width="3" height="7"/>
    <path class="ln" d="M30 78h60"/>`,
  substation: `
    <path class="ln" d="M8 78h104M18 78V28M48 78V28M72 78V28M102 78V28M12 28h96M12 36h96"/>
    <rect class="hl" x="28" y="52" width="10" height="16"/><rect class="hl" x="82" y="52" width="10" height="16"/>
    <path class="ln" d="M33 36v16M33 68v10M87 36v16M87 68v10"/>
    <rect class="fl" x="52" y="54" width="16" height="24"/>
    <path class="ln" d="M60 36v18"/>`,
  transformer: `
    <rect class="fl" x="36" y="18" width="44" height="9" rx="4.5"/>
    <path class="ln" d="M58 27v7"/>
    <rect class="fl" x="28" y="34" width="56" height="40"/>
    <path class="ln" d="M86 38v32M90 38v32M94 38v32M98 38v32M102 38v32M84 38h20M84 70h20"/>
    <path class="hl" d="M36 34l3-15h4l3 15zM50 34l3-15h4l3 15zM64 34l3-15h4l3 15z"/>
    <rect class="ln" x="36" y="44" width="16" height="10"/>
    <rect class="hl" x="24" y="74" width="64" height="5"/>`,
  switchgear: `
    <rect class="fl" x="14" y="16" width="30" height="62"/><rect class="fl" x="45" y="16" width="30" height="62"/><rect class="fl" x="76" y="16" width="30" height="62"/>
    <path class="ln" d="M14 34h92M14 56h92"/>
    <rect class="hl" x="20" y="22" width="10" height="6"/><rect class="hl" x="51" y="22" width="10" height="6"/><rect class="hl" x="82" y="22" width="10" height="6"/>
    <circle class="ln" cx="37" cy="45" r="3"/><circle class="ln" cx="68" cy="45" r="3"/><circle class="ln" cx="99" cy="45" r="3"/>
    <path class="ln" d="M20 64h14M51 64h14M82 64h14"/>`,
  cable: `
    <circle class="fl" cx="40" cy="48" r="30"/>
    <circle class="ln" cx="40" cy="48" r="22"/><circle class="ln" cx="40" cy="48" r="15"/>
    <circle class="hl" cx="40" cy="48" r="7"/>
    <path class="ln" d="M40 18c34 0 36 40 58 40" style="stroke-width:4"/>
    <circle class="fl" cx="104" cy="58" r="10"/>
    <circle class="hl" cx="100" cy="55" r="3"/><circle class="hl" cx="108" cy="55" r="3"/><circle class="hl" cx="104" cy="62" r="3"/>
    <path class="ln" d="M24 78h32"/>`,
  motor: `
    <rect class="fl" x="38" y="22" width="20" height="10"/>
    <rect class="fl" x="18" y="32" width="62" height="38" rx="5"/>
    <path class="ln" d="M28 36v30M36 36v30M44 36v30M52 36v30M60 36v30M68 36v30"/>
    <path class="fl" d="M80 38h8v26h-8z"/>
    <rect class="hl" x="88" y="48" width="22" height="6"/>
    <path class="ln" d="M26 70l-4 8h16l-4-8M64 70l-4 8h16l-4-8"/>`,
  robot: `
    <rect class="hl" x="16" y="70" width="34" height="8"/>
    <rect class="fl" x="24" y="62" width="18" height="8"/>
    <path class="ln" d="M33 62V48l28-20 28 12" style="stroke-width:9;stroke-linecap:round"/>
    <path d="M33 62V48l28-20 28 12" style="stroke:var(--signal);stroke-width:4;fill:none;stroke-linecap:round"/>
    <circle class="fl" cx="33" cy="48" r="5"/><circle class="fl" cx="61" cy="28" r="5"/>
    <path class="ln" d="M89 40l8 8M89 40l10 2M97 48v8M99 42h8"/>
    <rect class="ln" x="78" y="62" width="26" height="16"/>`,
  server: `
    <rect class="fl" x="18" y="12" width="38" height="66"/><rect class="fl" x="62" y="12" width="38" height="66"/>
    <path class="ln" d="M22 22h30M22 32h30M22 42h30M22 52h30M22 62h30M66 22h30M66 32h30M66 42h30M66 52h30M66 62h30"/>
    <rect class="hl" x="46" y="24" width="4" height="4"/><rect class="hl" x="46" y="44" width="4" height="4"/><rect class="hl" x="90" y="34" width="4" height="4"/><rect class="hl" x="90" y="54" width="4" height="4"/>
    <path class="ln" d="M10 78h100"/>`,
  train: `
    <path class="ln" d="M0 20h120M38 36l8-14 8 14M42 22h16"/>
    <path class="fl" d="M8 68V36h80l20 16v16z"/>
    <rect class="ln" x="16" y="42" width="12" height="9"/><rect class="ln" x="34" y="42" width="12" height="9"/><rect class="ln" x="52" y="42" width="12" height="9"/>
    <path class="ln" d="M88 40l14 12H88z"/>
    <rect class="hl" x="8" y="56" width="100" height="5"/>
    <circle class="fl" cx="24" cy="72" r="6"/><circle class="fl" cx="40" cy="72" r="6"/><circle class="fl" cx="76" cy="72" r="6"/><circle class="fl" cx="92" cy="72" r="6"/>
    <path class="ln" d="M0 79h120"/>`,
  mill: `
    <rect class="fl" x="36" y="28" width="66" height="38" rx="4"/>
    <path class="ln" d="M50 28v38M88 28v38"/>
    <rect class="fl" x="102" y="40" width="10" height="14"/>
    <circle class="fl" cx="34" cy="47" r="24"/>
    <path class="hl" d="M34 23l4 5h-8zM58 47l-5 4v-8zM34 71l-4-5h8zM10 47l5-4v8zM51 30l-1 6-5-5zM51 64l-6 0 5-5zM17 64l1-6 5 5zM17 30l6 0-5 5z"/>
    <circle class="hl" cx="28" cy="58" r="4"/><circle class="hl" cx="37" cy="61" r="4"/><circle class="hl" cx="22" cy="51" r="3.5"/><circle class="hl" cx="44" cy="56" r="3.5"/>
    <path class="ln" d="M24 71l-4 8h28l-4-8M80 66v12M96 66v12M74 79h28"/>`,
  crystal: `
    <path class="ln" d="M8 79h104"/>
    <path class="fl" d="M18 79l14-30 16 10 10 20z"/>
    <path class="hl" d="M40 79l10-44 18 16 6 28z"/>
    <path class="fl" d="M66 79l12-26 14 6 12 20z"/>
    <path class="ln" d="M50 35l4 44M68 51l-14 4M78 53l2 26"/>
    <path class="hl" d="M88 40l6-10 6 10-6 8z"/>`,
  wheel: `
    <circle class="fl" cx="46" cy="44" r="32"/>
    <circle class="ln" cx="46" cy="44" r="26" style="stroke-dasharray:2 3"/>
    <circle class="hl" cx="46" cy="44" r="10"/>
    <rect class="fl" x="46" y="41" width="64" height="6"/>
    <path class="hl" d="M70 70l14 6M66 74l8 10M74 66l16 2" style="stroke-width:2"/>
    <path class="ln" d="M14 79h56"/>`,
  ceramic: `
    <path class="fl" d="M30 22l14 8v16l-14 8-14-8V30z"/>
    <path class="hl" d="M58 22l14 8v16l-14 8-14-8V30z"/>
    <path class="fl" d="M86 22l14 8v16l-14 8-14-8V30z"/>
    <path class="fl" d="M44 46l14 8v16l-14 8-14-8V54z"/>
    <path class="fl" d="M72 46l14 8v16l-14 8-14-8V54z"/>`,
  polymer: `
    <circle class="fl" cx="34" cy="44" r="22"/><circle class="ln" cx="34" cy="44" r="13"/>
    <circle class="hl" cx="80" cy="34" r="14"/><circle class="fl" cx="80" cy="34" r="7"/>
    <rect class="fl" x="62" y="60" width="44" height="12" rx="6"/>
    <path class="ln" d="M70 60v12M78 60v12M86 60v12M94 60v12"/>`,
  compressor: `
    <rect class="fl" x="10" y="20" width="58" height="56"/>
    <circle class="ln" cx="39" cy="44" r="16"/><path class="ln" d="M39 28v32M23 44h32M28 33l22 22M50 33L28 55"/>
    <rect class="hl" x="16" y="66" width="20" height="5"/>
    <rect class="fl" x="72" y="44" width="40" height="28" rx="14"/>
    <circle class="hl" cx="92" cy="38" r="6"/><path class="ln" d="M92 44v-6M68 50h4M76 72v6M108 72v6"/>`,
  flame: `
    <rect class="fl" x="18" y="18" width="84" height="18" rx="9"/>
    <rect class="fl" x="18" y="42" width="84" height="18" rx="9"/>
    <path class="ln" d="M30 36v6M90 36v6M18 66h84"/>
    <path class="hl" d="M48 78c1-7 5-9 6-13 3 4 6 6 6 13zM64 78c1-7 5-9 6-13 3 4 6 6 6 13z"/>`,
  drop: `
    <ellipse class="fl" cx="34" cy="62" rx="26" ry="8"/>
    <path class="ln" d="M8 62v-16M60 62v-16"/><ellipse class="fl" cx="34" cy="46" rx="26" ry="8"/>
    <rect class="fl" x="70" y="22" width="16" height="54" rx="8"/><rect class="fl" x="92" y="22" width="16" height="54" rx="8"/>
    <path class="ln" d="M60 54h10M86 40h6"/>
    <path class="hl" d="M34 14c5 8 9 12 9 17a9 9 0 0 1-18 0c0-5 4-9 9-17z"/>`,
  engine: `
    <path class="fl" d="M24 38h60l8 10v26H16V48z"/>
    <rect class="hl" x="28" y="26" width="52" height="12"/>
    <path class="ln" d="M38 26v12M50 26v12M62 26v12M30 52h48M30 60h48"/>
    <circle class="fl" cx="102" cy="56" r="14"/><circle class="ln" cx="102" cy="56" r="4"/>
    <path class="ln" d="M16 74l-4 5h84l-4-5"/>`,
  building: `
    <path class="fl" d="M8 78V40l20-12v12l20-12v12l20-12v12l20-12v50z"/>
    <rect class="fl" x="92" y="10" width="10" height="68"/><rect class="hl" x="92" y="16" width="10" height="6"/>
    <rect class="hl" x="16" y="52" width="10" height="10"/><rect class="hl" x="36" y="52" width="10" height="10"/><rect class="hl" x="56" y="52" width="10" height="10"/>
    <rect class="ln" x="72" y="60" width="12" height="18"/>
    <path class="ln" d="M4 78h112"/>`,
  pipe: `
    <rect class="fl" x="4" y="40" width="112" height="16"/>
    <rect class="fl" x="30" y="36" width="5" height="24"/><rect class="fl" x="84" y="36" width="5" height="24"/>
    <rect class="fl" x="54" y="32" width="12" height="32"/>
    <path class="ln" d="M60 32V18M50 18h20"/><circle class="hl" cx="60" cy="16" r="3"/>
    <path class="ln" d="M16 56v22M104 56v22M10 78h12M98 78h12"/>`,
  solar: `
    <path class="hl" d="M8 58l12-24h40l-12 24z"/><path class="ln" d="M14 46h40M28 34l-8 24M40 34l-8 24"/>
    <path class="fl" d="M60 58l12-24h40l-12 24z"/><path class="ln" d="M66 46h40M80 34l-8 24M92 34l-8 24"/>
    <path class="ln" d="M28 58v20M80 58v20M4 78h112"/>
    <circle class="hl" cx="104" cy="14" r="7"/>`
};
