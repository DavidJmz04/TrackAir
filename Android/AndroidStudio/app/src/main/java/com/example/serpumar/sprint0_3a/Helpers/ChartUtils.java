package com.example.serpumar.sprint0_3a.Helpers;

import android.util.Log;
import android.view.View;

import com.anychart.AnyChart;
import com.anychart.AnyChartView;
import com.anychart.chart.common.dataentry.CategoryValueDataEntry;
import com.anychart.chart.common.dataentry.DataEntry;
import com.anychart.chart.common.dataentry.NameValueDataEntry;
import com.anychart.chart.common.dataentry.ValueDataEntry;
import com.anychart.charts.Cartesian;
import com.anychart.core.cartesian.series.Line;
import com.anychart.enums.Anchor;
import com.anychart.enums.HoverMode;
import com.anychart.enums.Position;
import com.anychart.enums.TooltipPositionMode;
import com.anychart.graphics.vector.Fill;
import com.anychart.palettes.RangeColors;
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
            data.add(new NameValueDataEntry(array.getJSONObject(i).getString("momento"), array.getJSONObject(i).getString("calidad"),  array.getJSONObject(i).getInt("valor")));
        }

        Line column = cartesian.line(data);

        column.tooltip()
                .titleFormat("{%X}")
                .position(Position.CENTER_BOTTOM)
                .anchor(Anchor.CENTER_BOTTOM)
                .offsetX(0d)
                .offsetY(5d)
                .fontColor("white")
                .format("{%Name}{groupsSeparator: } ({%Value})");

        column.color("#1ddba6");

        cartesian.animation(true);
        cartesian.background().fill("#1DDBA6");

        cartesian.yScale().minimum(0d);
        cartesian.yAxis(0).labels().format("{%Value}");
        cartesian.yAxis(0).labels().fontColor("white");
        cartesian.xAxis(0).labels().fontColor("white");
        RangeColors palette = RangeColors.instantiate();
        String[] colors = {"#f1ffe8", "#e8fcff", "#ffe8e8"};
        palette.items(colors, "#00ff00");
        palette.count(3);
        cartesian.yGrid(0).palette(palette);

        // set series labels text template
        (cartesian.getSeries(0).labels().enabled(true)).format("{%Name}");
        cartesian.getSeries(0).labels().fontColor("black");

        cartesian.tooltip().positionMode(TooltipPositionMode.POINT);
        cartesian.interactivity().hoverMode(HoverMode.BY_X);

        cartesian.xAxis(0).title("Hora");
        cartesian.xAxis(0).title().fontColor("white");
        cartesian.yAxis(0).title("Calidad");
        cartesian.yAxis(0).title().fontColor("white");

        anyChartView.setChart(cartesian);
        return anyChartView;
    }
}
