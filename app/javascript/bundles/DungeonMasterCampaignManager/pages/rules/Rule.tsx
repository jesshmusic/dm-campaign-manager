import React from 'react';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import rest from '../../api/api';
import { connect } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useEdition } from '../../contexts/EditionContext';
import { useBreadcrumbs } from '../../contexts/BreadcrumbContext';
import { GiDragonBreath } from 'react-icons/gi';
import { getContentUrl, parseEditionParams, getContentIndexUrl } from '../../utilities/editionUrls';
import { UserProps } from '../../utilities/types';
import { AdminActions } from '../../components/shared';
import RuleFormModal from './RuleFormModal';

import {
  RuleContent,
  RulesList,
  TableFrame,
  RuleNavigation,
  NavButton,
  NavButtonText,
  NavSpacer,
} from './Rule.styles';

type Ancestor = {
  name: string;
  slug: string;
};

type RuleNav = {
  name: string;
  slug: string;
};

type RulePageProps = {
  rule: {
    id: number;
    name: string;
    slug: string;
    description: string;
    ancestors?: Ancestor[];
    previous_rule?: RuleNav;
    next_rule?: RuleNav;
    rules: {
      name: string;
      slug: string;
    }[];
  } | null;
  loading: boolean;
  getRule: (ruleSlug: string) => void;
  deleteRule: (ruleId: number) => Promise<void>;
  currentUser?: UserProps;
};

const Rule = (props: RulePageProps) => {
  const { rule, loading, getRule, deleteRule, currentUser } = props;
  const params = useParams<{ edition?: string; ruleSlug?: string }>();
  const navigate = useNavigate();
  const { edition, slug: ruleSlug } = parseEditionParams(params.edition, params.ruleSlug);
  const { isEdition2014 } = useEdition();
  const { setCustomPaths } = useBreadcrumbs();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  // Track which slug we've fetched to prevent duplicate fetches
  const fetchedSlugRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    // Only fetch if the slug changed and we haven't already fetched it
    if (ruleSlug && ruleSlug !== fetchedSlugRef.current) {
      fetchedSlugRef.current = ruleSlug;
      getRule(ruleSlug);
    }
  }, [ruleSlug, getRule]);

  const handleEditSuccess = () => {
    if (ruleSlug) {
      getRule(ruleSlug);
    }
  };

  const handleDeleteSuccess = () => {
    navigate(getContentIndexUrl('rules', edition));
  };

  const handleDelete = async () => {
    if (rule && window.confirm(`Are you sure you want to delete ${rule.name}?`)) {
      await deleteRule(rule.id);
      handleDeleteSuccess();
    }
  };

  // Update breadcrumbs when rule data loads
  React.useEffect(() => {
    if (rule?.ancestors && rule.ancestors.length > 0) {
      const paths = [
        { title: 'Rules', url: getContentIndexUrl('rules', edition) },
        ...rule.ancestors.map((ancestor) => ({
          title: ancestor.name,
          url: getContentUrl('rules', ancestor.slug, edition),
        })),
        { title: rule.name, url: getContentUrl('rules', rule.slug, edition) },
      ];
      setCustomPaths(paths);
    } else {
      setCustomPaths(undefined);
    }

    // Clear custom paths when unmounting
    return () => setCustomPaths(undefined);
  }, [rule, edition, setCustomPaths]);

  const ruleTitle = rule ? rule.name : 'Loading...';

  return (
    <PageContainer
      description={`${ruleTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and Monsters.`}
      maxWidth
      pageTitle={ruleTitle}
    >
      {!loading && rule ? (
        <RuleContent>
          <PageTitle title={ruleTitle} isLegacy={isEdition2014} />
          <AdminActions
            currentUser={currentUser}
            onEdit={() => setIsEditModalOpen(true)}
            onDelete={handleDelete}
          />
          <ReactMarkdown
            components={{
              table: ({ node: _node, ...props }) => (
                <TableFrame>
                  <table {...props} />
                </TableFrame>
              ),
            }}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug]}
          >
            {rule.description}
          </ReactMarkdown>
          <RulesList>
            {rule.rules &&
              rule.rules.map((childRule) => (
                <Link key={childRule.slug} to={getContentUrl('rules', childRule.slug, edition)}>
                  <h2 style={{ border: 0 }}>{childRule.name}</h2>
                </Link>
              ))}
          </RulesList>

          {(rule.previous_rule || rule.next_rule) && (
            <RuleNavigation>
              {rule.previous_rule ? (
                <NavButton as={Link} to={getContentUrl('rules', rule.previous_rule.slug, edition)}>
                  <GiDragonBreath style={{ transform: 'rotate(135deg)' }} />
                  <NavButtonText>
                    <small>Previous</small>
                    <span>{rule.previous_rule.name}</span>
                  </NavButtonText>
                </NavButton>
              ) : (
                <NavSpacer />
              )}

              {rule.next_rule ? (
                <NavButton
                  as={Link}
                  to={getContentUrl('rules', rule.next_rule.slug, edition)}
                  style={{ textAlign: 'right' }}
                >
                  <NavButtonText style={{ alignItems: 'flex-end' }}>
                    <small>Next</small>
                    <span>{rule.next_rule.name}</span>
                  </NavButtonText>
                  <GiDragonBreath style={{ transform: 'rotate(-45deg)' }} />
                </NavButton>
              ) : (
                <NavSpacer />
              )}
            </RuleNavigation>
          )}
          <RuleFormModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            mode="edit"
            initialData={rule}
            onSuccess={handleEditSuccess}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </RuleContent>
      ) : (
        <DndSpinner />
      )}
    </PageContainer>
  );
};

function mapStateToProps(state: any) {
  return {
    rule: state.rules.currentRule,
    loading: state.rules.currentRuleLoading,
    currentUser: state.users.currentUser,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    getRule: (ruleSlug: string) => {
      dispatch(rest.actions.getRule({ id: ruleSlug }));
    },
    deleteRule: (ruleId: number) => {
      return dispatch(rest.actions.deleteRule({ id: ruleId }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Rule);
