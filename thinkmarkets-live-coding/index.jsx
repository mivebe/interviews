const Component = () => {

	const items = [
		{
			img: "",
			url: '',
			contentType: '',
		},
	]

	return (
		<Page>
			<Header>
				<Nav items={["teams"]} />
				<img alt='logo' /> |
				<TeamLink address={'http://'} />
				<Nav items={[""]} />
			</Header>

		</Page>
	)
}

const Nav = ({ items }) => {
	return (
		<div>
			{items && items.map(item => {
				{
					item?.img && <>
						<img />
					</>
				}
			})}
		</div>
	)
}