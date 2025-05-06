// components/EcommerceViewsReport.tsx
/*
'use client';

import { useEffect } from 'react';
import $ from 'jquery';

import 'datatables.net-buttons/js/dataTables.buttons';
import 'datatables.net-buttons/js/buttons.html5';
import 'datatables.net-buttons/js/buttons.print';
import moment from 'moment';
import 'datatables.net-dt/js/dataTables.dataTables';
//import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-dt/css/dataTables.dataTables.css';
import 'daterangepicker/daterangepicker.css';
//import 'daterangepicker.d.ts';

const EcommerceViewsReport = () => {
  useEffect(() => {
    const table = document.querySelector('#kt_ecommerce_report_views_table') as HTMLTableElement;
    const searchInput = document.querySelector('[data-kt-ecommerce-order-filter="search"]') as HTMLInputElement;
    const ratingFilter = document.querySelector('[data-kt-ecommerce-order-filter="rating"]') as HTMLSelectElement;

    if (!table) return;

    const dataTable = $(table).DataTable({
      info: false,
      order: [],
      pageLength: 10,
    });

    // Date Range Picker
    const start = moment().subtract(29, 'days');
    const end = moment();
    const dateRangePicker = $('#kt_ecommerce_report_views_daterangepicker');

    const cb = (start: moment.Moment, end: moment.Moment) => {
      dateRangePicker.html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    };

    dateRangePicker.daterangepicker(
      {
        startDate: start,
        endDate: end,
        ranges: {
          오늘: [moment(), moment()],
          어제: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          '지난 7일': [moment().subtract(6, 'days'), moment()],
          '지난 30일': [moment().subtract(29, 'days'), moment()],
          '이번 달': [moment().startOf('month'), moment().endOf('month')],
          '다음 달': [moment().add(1, 'month').startOf('month'), moment().add(1, 'month').endOf('month')],
        },
      },
      cb
    );

    cb(start, end);

    // Export Buttons
    const reportTitle = 'Product Views Report';
    new $.fn.dataTable.Buttons(table, {
      buttons: [
        { extend: 'copyHtml5', title: reportTitle },
        { extend: 'excelHtml5', title: reportTitle },
        { extend: 'csvHtml5', title: reportTitle },
        { extend: 'pdfHtml5', title: reportTitle },
      ],
    }).container().appendTo($('#kt_ecommerce_report_views_export'));

    document.querySelectorAll('[data-kt-ecommerce-export]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const type = (e.target as HTMLElement).getAttribute('data-kt-ecommerce-export');
        document.querySelector(`.dt-buttons .buttons-${type}`)?.dispatchEvent(new Event('click'));
      });
    });

    // Search filter
    searchInput?.addEventListener('keyup', (e: Event) => {
      const value = (e.target as HTMLInputElement).value;
      dataTable.search(value).draw();
    });

    // Rating filter
    $(ratingFilter).on('change', (e: Event) => {
      let value = (e.target as HTMLSelectElement).value;
      if (value === 'all') value = '';
      dataTable.column(2).search(value).draw();
    });
  }, []);

  return null; // This component runs logic only
};

export default EcommerceViewsReport;




/*-- 사용 위치 예시 (app/page.tsx 등)
import EcommerceViewsReport from '@/components/EcommerceViewsReport';

export default function Page() {
  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          className="form-control form-control-solid w-100 mw-250px"
          placeholder="Pick date range"
          id="kt_ecommerce_report_views_daterangepicker"
          type="text"
        />
      </div>

      {// 여기에 테이블 요소나 <EcommerceViewsReport /> 삽입 //}
      </div>
    );
  }
  *--/
  */