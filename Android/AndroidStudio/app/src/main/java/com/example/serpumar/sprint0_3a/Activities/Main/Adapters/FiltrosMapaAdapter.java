package com.example.serpumar.sprint0_3a.Activities.Main.Adapters;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.graphics.Typeface;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseExpandableListAdapter;
import android.widget.CheckBox;
import android.widget.RadioButton;
import android.widget.TextView;

import androidx.fragment.app.FragmentActivity;

import com.example.serpumar.sprint0_3a.Models.FiltrosMapa;
import com.example.serpumar.sprint0_3a.R;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;

public class FiltrosMapaAdapter extends BaseExpandableListAdapter {

    private Activity _context;
    private List<FiltrosMapa> _listDataHeader;
    private HashMap<String, List<String>> _listDataChild;
    int selectedPosition = 0;

    HashMap<Integer, Integer> childCheckedState = new HashMap<>();
    HashMap<Integer, Integer> childCheckboxState = new HashMap<>();
    ArrayList<String> listOfStatusFilters = new ArrayList<>();

    ArrayList<ArrayList<Integer>> check_states = new ArrayList<ArrayList<Integer>>();

    public FiltrosMapaAdapter(FragmentActivity _context, List<FiltrosMapa> _listDataHeader, HashMap<String, List<String>> _listDataChild) {
        this._context = _context;
        this._listDataHeader = _listDataHeader;
        this._listDataChild = _listDataChild;
    }

    @Override
    public int getGroupCount() {
        return this._listDataHeader.size();
    }

    @Override
    public int getChildrenCount(int groupPosition) {
        return this._listDataChild.get(this._listDataHeader.get(groupPosition).getTitle())
                .size();
    }

    @Override
    public FiltrosMapa getGroup(int groupPosition) {
        return this._listDataHeader.get(groupPosition);
    }

    @Override
    public Object getChild(int groupPosition, int childPosition) {
        return this._listDataChild.get(this._listDataHeader.get(groupPosition).getTitle())
                .get(childPosition);
    }

    @Override
    public long getGroupId(int groupPosition) {
        return groupPosition;
    }

    @Override
    public long getChildId(int groupPosition, int childPosition) {
        return childPosition;
    }

    @Override
    public boolean hasStableIds() {
        return false;
    }

    @SuppressLint("InflateParams")
    @Override
    public View getGroupView(int groupPosition, boolean isExpanded, View convertView, ViewGroup parent) {
        String headerTitle = (String) getGroup(groupPosition).getTitle();
        //if (convertView == null) {
        LayoutInflater infalInflater = (LayoutInflater) this._context
                .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        convertView = Objects.requireNonNull(infalInflater).inflate(R.layout.filter_header_layout, null);
        //}

        TextView lblListHeader = convertView.findViewById(R.id.lblListHeader);
        lblListHeader.setTypeface(null, Typeface.BOLD);
        lblListHeader.setText(headerTitle);
        TextView groupStatus = convertView.findViewById(R.id.groupStatus);

        groupStatus.setText(_listDataHeader.get(groupPosition).getActiveFilter());


        return convertView;
    }

    @SuppressLint("InflateParams")
    @Override
    public View getChildView(final int groupPosition, final int childPosition, boolean isLastChild, View convertView, ViewGroup parent) {
        final String childText = (String) getChild(groupPosition, childPosition);
        final FiltrosMapa headerText = (FiltrosMapa) getGroup(groupPosition);
        //if (convertView == null) {
        LayoutInflater infalInflater = (LayoutInflater) this._context
                .getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        convertView = Objects.requireNonNull(infalInflater).inflate(R.layout.filter_child_layout, null);
        // }

        final TextView filterName = convertView.findViewById(R.id.textviewFilterName);
        filterName.setText(childText);
        final CheckBox filterCheckBox = convertView.findViewById(R.id.filterNameCheckBox);
        final RadioButton filterRadioButton = convertView.findViewById(R.id.filterNameRadioButton);
        //txtListChild.setText(childText);
        if (groupPosition > 0) {
            filterCheckBox.setVisibility(View.GONE);
            filterRadioButton.setVisibility(View.VISIBLE);
        } else {
            filterCheckBox.setVisibility(View.VISIBLE);
            filterRadioButton.setVisibility(View.GONE);
        }




        View view = parent.getChildAt(groupPosition);

        try {


            try {
                if (childCheckedState != null)
                    if (childCheckedState.size() > 0)
                        filterRadioButton.setChecked(childPosition == childCheckedState.get(groupPosition));
            } catch (Exception e) {
                e.printStackTrace();
            }
            filterRadioButton.setTag(childPosition);
            filterRadioButton.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    childCheckedState.put(groupPosition, (Integer) v.getTag());
                    if (_listDataChild.get(headerText.getTitle()) != null) {
                        headerText.setActiveFilter(_listDataChild.get(headerText.getTitle()).get(childPosition));

                    }
                    notifyDataSetChanged();


                }
            });

            if (childCheckboxState.size() > 0) {
                if (childCheckboxState.get(childPosition) != null) {
                    if (childCheckboxState.get(childPosition) == 0) {
                        filterCheckBox.setChecked(false);
                    } else {
                        filterCheckBox.setChecked(true);
                    }
                }
            }

            filterCheckBox.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    if (filterCheckBox.isChecked()) {
                        childCheckboxState.put(childPosition, 1);
                        listOfStatusFilters.add(_listDataChild.get(headerText.getTitle()).get(childPosition));
                    } else {
                        childCheckboxState.put(childPosition, 0);
                        listOfStatusFilters.remove(_listDataChild.get(headerText.getTitle()).get(childPosition));
                    }

                    if (_listDataChild.get(headerText.getTitle()) != null)
                        headerText.setActiveFilter(getCheckedStatusCombinedString());
                    notifyDataSetChanged();

                }
            });

        } catch (Exception e) {

        }
        return convertView;
    }

    @Override
    public boolean isChildSelectable(int groupPosition, int childPosition) {
        return true;
    }


    public String getCheckedStatusCombinedString() {
        String status = "";
        for (int i = 0; i < listOfStatusFilters.size(); i++) {
            status += listOfStatusFilters.get(i);
            if (i != listOfStatusFilters.size() - 1) {
                status += ",";
            }
        }
        return status;
    }


}
