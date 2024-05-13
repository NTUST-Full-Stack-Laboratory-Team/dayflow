import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import ReactModal from 'react-modal'
import { Button, Modal } from "antd";

interface PieChartProps {
    data: number[];
    labels: string[];
}

interface Props extends PieChartProps {
    isOpen: boolean;
    onClose?: () => void;
}

export const PieChartDialog = (props: Props) => {
    const { isOpen, onClose } = props;

    const handleClose = () => {
        onClose?.();
    }

    return (
        <div>
            <Modal open={isOpen} onOk={handleClose} onCancel={handleClose}>
                <PieChart data={props.data} labels={props.labels} />
            </Modal>
        </div>
    )
}

const PieChart: React.FC<PieChartProps> = ({ data, labels }) => {
    const chartContainer = useRef<HTMLCanvasElement>(null);
    let chartInstance: Chart | null = null;

    useEffect(() => {
        if (chartContainer.current) {
            // 销毁之前的图表实例
            if (chartInstance) {
                chartInstance.destroy();
            }

            const ctx = chartContainer.current.getContext('2d');
            if (ctx) {
                chartInstance = new Chart(ctx, {
                    type: 'pie',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Pie Chart',
                                data: data,
                                backgroundColor: [
                                    '#cfbaf0',
                                    '#ffcfd2',
                                    '#90dbf4',
                                    '#f1c0e8',
                                    '#fde4cf',
                                    '#a3c4f3',
                                    '#98f5e1',
                                    '#fbf8cc',
                                    '#b9fbc0',
                                    '#8eecf5',
                                ],
                            },
                        ],
                    },
                });
            }
        }

        // 在组件销毁时销毁图表实例
        return () => {
            if (chartInstance) {
                chartInstance.destroy();
            }
        };
    }, [data, labels]);

    return <canvas ref={chartContainer} />;
};

export default PieChartDialog;
