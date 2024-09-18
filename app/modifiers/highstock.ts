import Modifier, { type NamedArgs, type PositionalArgs } from 'ember-modifier';
import { tracked } from '@glimmer/tracking';
import type * as Highcharts from 'highcharts';
import { stockChart } from 'highcharts/highstock';

interface HighchartsSignature {
  // TODO: Specify the correct `Element` type:
  Element: Element;
  Args: {
    Named: {};
    Positional: [];
  };
}

export default class HighchartsModifier extends Modifier<HighchartsSignature> {
  #chart: Highcharts.Chart | undefined;
  modify(
    element: HighchartsSignature['Element'],
    [opts]: PositionalArgs<HighchartsSignature>,
    named: NamedArgs<HighchartsSignature>,
  ) {
    if (this.#chart) {
      this.#chart.update(opts, true, true);
    } else {
      this.#chart = stockChart(element, opts);
    }
  }

  @tracked highcharts: typeof Highcharts | undefined;
}
