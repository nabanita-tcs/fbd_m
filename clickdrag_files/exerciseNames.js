var exerciseNames = {
		'SLE' : {
			'exerciseText' : 'Labeling',
			'OTO': 'One Label to One Dock',
			'OTM': 'Same Label to Multiple Docks',
			'TYPE': {
				'DLE':'Display Each Label Instance',
				'DLO':'Display Label Once'
			},
			'exerciseExplanation':'Students drag labels to individual docks, which may include lines that point to specific areas to be identified.'
			},
		'CLS' : {
			'exerciseText' : 'Grouping',
			'OTO': 'One Label to One Dock',
			'OTM': 'Same Label to Multiple Docks',
			'TYPE': {
				'DLE':'Display Each Label Instance',
				'DLO':'Display Label Once'
			},
			'exerciseExplanation':'Students group labels according to classification or category by dragging all related labels into a single corresponding dock.'
		},
		'PRG' : {
			'exerciseText' : 'Text Completion/Ordering',
			'OTO': 'One Label to One Dock',
			'OTM': 'Same Label to Multiple Docks',
			'senOrder': 'Turn Ordering On',
			'lockOrder': 'Turn Ordering Off',
			'TYPE': {
				'DLE':'Display Each Label Instance',
				'DLO':'Display Label Once'
			},
			'exerciseExplanation':'Students complete text by dragging text-only labels to fill in blanks or, students arrange blocks of text into the required order, or students both complete and reorder text.',
			'Note' : 'Text blocks need to be authored in a single vertical column as that is how they will be displayed to students.'
		},
		'COI' : {
			'exerciseText' : 'Click to Select',
			'TYPE': {
				'MS':'Multiple Selection',
				'SS':'Single Selection'
			},
			/* Text change as per requirement for prod issues */
			'exerciseExplanation':'Students are presented with a static set of labels and they click on one or multiple labels to indicate their answer choices.'
		}/*,
		'SE' : {
			'exerciseText' : 'Student Exploration',
			'exerciseExplanation':'Students click on stationary labels to indicate the correct answer(s). When there is only one correct answer, students can only select a single label. When there are multiple correct answers, students can select multiple labels.'
		}*/
};