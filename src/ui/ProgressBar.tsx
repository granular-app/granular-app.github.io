import classNames from 'classnames';

export function ProgressBar(props: {
	/**
	 * A value between 0 and 1.
	 */
	progress: number;
	className?: string;
}) {
	return (
		<div className={classNames('overflow-hidden bg-gray-200', props.className)}>
			<div
				className="h-full origin-left transform bg-gray-500 transition-transform"
				style={{ ['--tw-scale-x' as any]: `${props.progress}` }}
			>
				{props.progress < 1 && (
					<div className="h-full w-full bg-repeat heropattern-diagonalstripes-gray-400"></div>
				)}
			</div>
		</div>
	);
}
