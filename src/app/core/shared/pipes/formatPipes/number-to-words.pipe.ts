import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToWords'
})
export class NumberToWordsPipe implements PipeTransform {

  transform(value: number): any {
    if (!value) { return ''; }
    if (value === undefined) { return ''; }
    const data = {
      numero: value,
      enteros: Math.floor(value),
      centavos: (((Math.round(value * 100)) - (Math.floor(value) * 100))),
      letrasCentavos: '',
      letrasMonedaPlural: 'Quetzales',
      letrasMonedaSingular: 'Quetzal',
      letrasMonedaCentavoPlural: 'Centavos',
      letrasMonedaCentavoSingular: 'Centavos'
    };

    if (data.centavos > 0) {
      data.letrasCentavos = 'con ' + (() => {
          if (data.centavos === 1) {
            return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoSingular;
          } else {
            return Millones(data.centavos) + ' ' + data.letrasMonedaCentavoPlural;
          }
      })();
    }

    if (data.enteros === 0) {
      return 'cero ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
    }
    if (data.enteros === 1) {
      return Millones(data.enteros) + ' ' + data.letrasMonedaSingular + ' ' + data.letrasCentavos;
    } else {
      return Millones(data.enteros) + ' ' + data.letrasMonedaPlural + ' ' + data.letrasCentavos;
    }

    function Unidades(num) {
      switch (num) {
          case 1: return 'Un';
          case 2: return 'Dos';
          case 3: return 'Tres';
          case 4: return 'Cuatro';
          case 5: return 'Cinco';
          case 6: return 'Seis';
          case 7: return 'Siete';
          case 8: return 'Ocho';
          case 9: return 'Nueve';
      }
      return '';
    }

    function Decenas(num) {

      const decena = Math.floor(num / 10);
      const unidad = num - (decena * 10);
      switch (decena) {
          case 1:
              switch (unidad) {
                case 0: return 'Diez';
                case 1: return 'Once';
                case 2: return 'Doce';
                case 3: return 'Trece';
                case 4: return 'Catorce';
                case 5: return 'Quince';
                default: return 'Dieci' + Unidades(unidad);
              }
          case 2:
              switch (unidad) {
                  case 0: return 'Veinte';
                  default: return 'Veinti' + Unidades(unidad);
              }
          case 3: return DecenasY('Treinta', unidad);
          case 4: return DecenasY('Cuarenta', unidad);
          case 5: return DecenasY('Cincuenta', unidad);
          case 6: return DecenasY('Sesenta', unidad);
          case 7: return DecenasY('Setenta', unidad);
          case 8: return DecenasY('Ochenta', unidad);
          case 9: return DecenasY('Noventa', unidad);
          case 0: return Unidades(unidad);
      }
    }

    function DecenasY(strSin, numUnidades) {
      if (numUnidades > 0) {
        return strSin + ' y ' + Unidades(numUnidades);
      }
      return strSin;
    }

    function Centenas(num) {
      const centenas = Math.floor(num / 100);
      const decenas = num - (centenas * 100);

      switch (centenas) {
          case 1:
            if (decenas > 0) {
              return 'Ciento ' + Decenas(decenas);
            }
            return 'Cien';
          case 2: return 'Doscientos ' + Decenas(decenas);
          case 3: return 'Trecientos ' + Decenas(decenas);
          case 4: return 'Cuatrocientos ' + Decenas(decenas);
          case 5: return 'Quinientos ' + Decenas(decenas);
          case 6: return 'Seiscientos ' + Decenas(decenas);
          case 7: return 'Setecientos ' + Decenas(decenas);
          case 8: return 'Ochocientos ' + Decenas(decenas);
          case 9: return 'Novecientos ' + Decenas(decenas);
      }
      return Decenas(decenas);
    }

    function Seccion(num, divisor, strSingular, strPlural) {
      const cientos = Math.floor(num / divisor);
      const resto = num - (cientos * divisor);

      let letras = '';

      if (cientos > 0) {
        if (cientos > 1) {
          letras = Centenas(cientos) + ' ' + strPlural;
        } else {
          letras = strSingular;
        }
      }

      if (resto > 0) {
        letras += '';
      }

      return letras;
    }

    function Miles(num) {
      const divisor = 1000;
      const cientos = Math.floor(num / divisor);
      const resto = num - (cientos * divisor);

      const strMiles = Seccion(num, divisor, 'Un Mil', 'Mil');
      const strCentenas = Centenas(resto);

      if (strMiles === '') {
        return strCentenas;
      }
      return strMiles + ' ' + strCentenas;
    }

    function Millones(num) {
      const divisor = 1000000;
      const cientos = Math.floor(num / divisor);
      const resto = num - (cientos * divisor);
      const strMillones = Seccion(num, divisor, 'Un Millón de', 'Millones de');
      const strMiles = Miles(resto);

      if (strMillones === '') {
        return strMiles;
      }
      return strMillones + ' ' + strMiles;
    }



    return '';
  }

}
