package com.example.serpumar.sprint0_3a.Activities.Main.Fragments;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import androidx.fragment.app.Fragment;

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

import java.util.ArrayList;
import java.util.List;

public class ChartsFragment extends Fragment {

    AnyChartView anyChartView;

    public ChartsFragment() {
        // Required empty public constructor
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View v = inflater.inflate(R.layout.fragment_charts, container, false);
        anyChartView = v.findViewById(R.id.any_chart_view);
        cargarGrafico(v);
        return v;
    }
    public void cargarGrafico(View v){
        anyChartView.setProgressBar(v.findViewById(R.id.progress_bar));

        Cartesian cartesian = AnyChart.line();


        List<DataEntry> data = new ArrayList<>();
        data.add(new ValueDataEntry("10:00", 80540));
        data.add(new ValueDataEntry("11:00", 94190));
        data.add(new ValueDataEntry("12:00", 102610));
        data.add(new ValueDataEntry("13:00", 110430));
        data.add(new ValueDataEntry("14:00", 128000));
        data.add(new ValueDataEntry("15:00", 143760));
        data.add(new ValueDataEntry("16:00", 170670));
        data.add(new ValueDataEntry("17:00", 213210));
        data.add(new ValueDataEntry("22:00", 249980));

        Line column = cartesian.line(data);

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

        cartesian.yAxis(0).labels().format("${%Value}{groupsSeparator: }");

        cartesian.tooltip().positionMode(TooltipPositionMode.POINT);
        cartesian.interactivity().hoverMode(HoverMode.BY_X);

        cartesian.xAxis(0).title("Calidad");
        cartesian.yAxis(0).title("Hora");

        anyChartView.setChart(cartesian);
    }
}
