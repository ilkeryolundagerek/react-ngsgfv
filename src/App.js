import React from 'react';
import './style.css';

function format(n, c) {
  return n
    .toFixed(c)
    .replace('.', ',')
    .replace(/(\d)(?=(\d{3})+\,)/g, '$1.');
}
function vergi_dilim(m, i) {
  let dilimler = [0, 32000, 70000, 250000, 880000];
  let yuzdeler = [0.15, 0.05, 0.07, 0.08, 0.05];
  let mi = m * i;
  let omi = m * (i - 1);
  if (mi <= 32000) {
    return m * 0.15;
  } else if (mi <= 70000) {
    if (omi <= 32000) {
      return m * 0.15 + (mi - 32000) * 0.05;
    } else {
      return m * 0.2;
    }
  } else if (mi > 70000 && mi <= 250000) {
    if (omi <= 70000) {
      return m * 0.2 + (mi - 70000) * 0.07;
    } else {
      return m * 0.27;
    }
  } else if (mi > 250000 && mi <= 880000) {
    if (omi <= 250000) {
      return m * 0.27 + (mi - 250000) * 0.08;
    } else {
      return m * 0.35;
    }
  } else if (mi > 880000) {
    if (omi <= 880000) {
      return m * 0.35 + (mi - 880000) * 0.05;
    } else {
      return m * 0.4;
    }
  }
}

function calculate() {
  let asgari_brut = 5004.0;
  let asgari_gv_matrah = asgari_brut * 0.85;
  let ust_sinir = 37530.0;
  let headers = [
    'Ay',
    'Brüt Ücret',
    'SGK İşçi Payı (%14)',
    'İşsizlik İşçi Payı (%1)',
    'Gelir Vergisi Matrahı',
    'Kümülatif Gelir Vergisi Matrahı',
    'Hesaplanan Gelir Vergisi (a)',
    'İstisnaya Tekabül Eden Asgari Ücret Gelir Vergisi (b)',
    'Ödenecek Gelir Vergisi (a-b)',
    'Damga Vergisi Matrahı',
    'Damga Vergisi',
    'Net Ücret',
    'SGK İşveren Payı (%20,5)',
    'İşsizlik İşveren Payı (%2)',
    'İşveren Maliyeti',
    'Maliyet %5 İndirimli',
  ];
  let result = [];
  var calc_body = document.getElementById('calc_body');
  var brut = parseFloat(document.getElementById('brut').value);
  for (let i = 1; i < 13; i++) {
    let line = {};
    line.ay = i;
    line.brut = brut;
    line.p14 = brut * 0.14;
    line.p1 = brut * 0.01;
    line.gvm = brut - line.p14 - line.p1;
    line.kgv = line.gvm * i;
    line.hgv = vergi_dilim(line.gvm, i);
    line.iteaugv = vergi_dilim(asgari_gv_matrah, i);
    line.ogv = line.hgv - line.iteaugv;
    line.dvm = brut - asgari_brut;
    line.dv = line.dvm * 0.00759;
    line.net = line.gvm - line.ogv - line.dv;
    line.sgkip = brut * 0.205;
    line.iip = brut >= ust_sinir ? brut * 0.205 : brut * 0.02;
    line.im = line.sgkip + line.iip + brut;
    line.m5i = brut * 1.155 + line.iip;
    result.push(line);
  }
  let str = '';
  for (let i = 0; i < 12; i++) {
    let line = result[i];
    str +=
      '<tr>' +
      '<td>' +
      line.ay +
      '</td>' +
      '<td>' +
      format(line.brut, 2) +
      ' TL' +
      '</td>' +
      '<td>' +
      format(line.p14, 2) +
      ' TL' +
      '</td>' +
      '<td>' +
      format(line.p1, 2) +
      ' TL' +
      '</td>' +
      '<td>' +
      format(line.gvm, 2) +
      ' TL' +
      '</td>' +
      '<td>' +
      format(line.kgv, 2) +
      ' TL' +
      '</td>' +
      '<td>' +
      format(line.hgv, 0) +
      ' TL' +
      '</td>' +
      '<td>' +
      format(line.iteaugv, 0) +
      ' TL' +
      '</td>' +
      '<td>' +
      format(line.ogv, 2) +
      ' TL' +
      '</td>' +
      '<td>' +
      format(line.dvm, 2) +
      ' TL' +
      '</td>' +
      '<td>' +
      format(line.dv, 2) +
      ' TL' +
      '</td>' +
      '<td>' +
      format(line.net, 2) +
      ' TL' +
      '</td>' +
      '<td>' +
      format(line.sgkip, 2) +
      ' TL' +
      '</td>' +
      '<td>' +
      format(line.iip, 2) +
      ' TL' +
      '</td>' +
      '<td>' +
      format(line.im, 2) +
      ' TL' +
      '</td>' +
      '<td>' +
      format(line.m5i, 2) +
      ' TL' +
      '</td>' +
      '</tr>';
  }
  calc_body.innerHTML = str;
}

export default function App() {
  return (
    <table class="table">
      <thead class="">
        <tr>
          <th colspan="3" class="nowrap">
            <strong>Ücret (Brüt): </strong>
            <input type="text" onChange={calculate} id="brut" />
          </th>
        </tr>
        <tr>
          <th>Ay</th>
          <th class="nowrap">Brüt Ücret</th>
          <th class="nowrap">SGK İşçi Payı (%14)</th>
          <th class="nowrap">İşsizlik İşçi Payı (%1)</th>
          <th class="nowrap">Gelir Vergisi Matrahı</th>
          <th class="nowrap">Kümülatif Gelir Vergisi Matrahı</th>
          <th class="nowrap">Hesaplanan Gelir Vergisi</th>
          <th class="nowrap">
            İstisnaya Tekabül Eden Asgari Ücret Gelir Vergisi
          </th>
          <th class="nowrap">Ödenecek Gelir Vergisi</th>
          <th class="nowrap">Damga Vergisi Matrahı</th>
          <th class="nowrap">Damga Vergisi</th>
          <th class="nowrap">Net Ücret</th>
          <th class="nowrap">SGK İşveren Payı (%20,5)</th>
          <th class="nowrap">İşsizlik İşveren Payı (%2)</th>
          <th class="nowrap">İşveren Maliyeti</th>
          <th class="nowrap">Maliyet %5 İndirimli</th>
        </tr>
      </thead>
      <tbody id="calc_body"></tbody>
    </table>
  );
}
