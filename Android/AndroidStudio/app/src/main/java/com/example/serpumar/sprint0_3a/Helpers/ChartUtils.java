package com.example.serpumar.sprint0_3a.Helpers;

import android.view.View;

import com.anychart.AnyChart;
import com.anychart.AnyChartView;
import com.anychart.chart.common.dataentry.DataEntry;
import com.anychart.chart.common.dataentry.ValueDataEntry;
import com.anychart.charts.Cartesian;
import com.anychart.core.cartesian.series.Line;
import com.anychart.enums.Anchor;
import com.anychart.enums.HoverMode;
import com.anychart.enums.Position;
import com.anychart.enums.TooltipPositionMode;
import com.example.serpumar.sprint0_3a.R;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

public class ChartUtils {

    public static AnyChartView cargarGrafico(AnyChartView anyChartView, JSONArray array) throws JSONException {
        Cartesian cartesian = AnyChart.line();

        List<DataEntry> data = new ArrayList<>();
        for (int i = 0; i < array.length(); i++) {
            data.add(new ValueDataEntry(array.getJSONObject(i).getString("momento"), array.getJSONObject(i).getInt("valor"),{"x:" + array.getJSONObject()}));
        }

        Line column = cartesian.line(data);
        cartesian.yAxis("");

        column.tooltip()
                .titleFormat("{%X}")
                .position(Position.CENTER_BOTTOM)
                .anchor(Anchor.CENTER_BOTTOM)
                .offsetX(0d)
                .offsetY(5d)
                .format("{%Value}{groupsSeparator: }");

        column.color("#1ddba6");

        cartesian.animation(true);
        cartesian.title("Calidad del aire");

        cartesian.yScale().minimum(0d);

        cartesian.yAxis(0).labels().format("{%x}");

        cartesian.tooltip().positionMode(TooltipPositionMode.POINT);
        cartesian.interactivity().hoverMode(HoverMode.BY_X);

        cartesian.xAxis(0).title("Hora");
        cartesian.yAxis(0).title("Calidad");

        anyChartView.setChart(cartesian);
        return anyChartView;
    }
}
