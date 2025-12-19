import React from 'react';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rest from '../../api/api';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import { useEdition } from '../../contexts/EditionContext';
import { getContentUrl, isValidEdition } from '../../utilities/editionUrls';
import {
  RuleContent,
  TableFrame,
  GlossaryTOC,
  GlossaryTOCItem,
  GlossarySection,
  GlossarySectionTitle,
  GlossaryTermList,
  GlossaryTermItem,
  GlossarySourceInfo,
} from './RulesGlossary.styles';

const RULES_GLOSSARY_SLUG = 'rules-glossary';

type GlossaryTerm = {
  id: number;
  name: string;
  slug: string;
  description: string;
  subcategory: string | null;
};

type GlossaryCategory = {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  rules: GlossaryTerm[];
};

type RulesGlossaryRule = {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory: string | null;
  count: number;
  rules: GlossaryCategory[];
};

type RulesGlossaryProps = {
  rule: RulesGlossaryRule | null;
  loading: boolean;
  getRule: (ruleSlug: string) => void;
};

// Sort categories in a logical order
const CATEGORY_ORDER = [
  'Actions',
  'Conditions',
  'Areas of Effect',
  'Attitudes',
  'Combat',
  'Hazards',
  'Movement & Speeds',
  'Rests',
  'General Terms',
  'Tables',
];

const sortCategories = (categories: GlossaryCategory[]): GlossaryCategory[] => {
  return [...categories].sort((a, b) => {
    const indexA = CATEGORY_ORDER.indexOf(a.name);
    const indexB = CATEGORY_ORDER.indexOf(b.name);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.name.localeCompare(b.name);
  });
};

const RulesGlossary = ({ rule, loading, getRule }: RulesGlossaryProps) => {
  const { edition: editionParam, param } = useParams<{ edition?: string; param?: string }>();
  const { edition: contextEdition, isEdition2014 } = useEdition();

  // Use edition from URL if valid (either :edition or :param route), otherwise from context
  // Note: param would be 'rules-glossary' when accessed via /app/rules/rules-glossary
  const urlEdition = editionParam || (param !== 'rules-glossary' ? param : undefined);
  const edition = isValidEdition(urlEdition) ? urlEdition : contextEdition;

  const hasFetchedRef = React.useRef(false);

  React.useEffect(() => {
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      getRule(RULES_GLOSSARY_SLUG);
    }
  }, [getRule]);

  const sortedCategories = React.useMemo(() => {
    if (!rule?.rules) return [];
    return sortCategories(rule.rules);
  }, [rule]);

  const scrollToCategory = (slug: string) => {
    const element = document.getElementById(slug);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <PageContainer
      description="D&D 5th Edition Rules Glossary - Quick reference for game terms, conditions, actions, and more."
      maxWidth
      pageTitle="Rules Glossary"
    >
      {loading || !rule ? (
        <DndSpinner />
      ) : (
        <RuleContent>
          <PageTitle title="Rules Glossary" isLegacy={isEdition2014} />

          <GlossarySourceInfo>
            <p>
              <em>Source: System Reference Document 5.2.1</em>
            </p>
            <p>
              <em>License: Creative Commons Attribution 4.0 International License</em>
            </p>
          </GlossarySourceInfo>

          {/* Introduction - Conventions and Abbreviations */}
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

          {/* Table of Contents */}
          <GlossaryTOC>
            <h3>Quick Navigation</h3>
            <div>
              {sortedCategories.map((category) => (
                <GlossaryTOCItem
                  key={category.slug}
                  onClick={() => scrollToCategory(category.slug)}
                >
                  {category.name} ({category.count})
                </GlossaryTOCItem>
              ))}
            </div>
          </GlossaryTOC>

          {/* Category Sections */}
          {sortedCategories.map((category) => (
            <GlossarySection key={category.slug} id={category.slug}>
              <GlossarySectionTitle>{category.name}</GlossarySectionTitle>
              {category.description && (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{category.description}</ReactMarkdown>
              )}
              <GlossaryTermList>
                {category.rules.map((term) => (
                  <GlossaryTermItem key={term.slug}>
                    <Link to={getContentUrl('rules', term.slug, edition)}>
                      <strong>{term.name}</strong>
                    </Link>
                    <ReactMarkdown
                      components={{
                        table: ({ node: _node, ...props }) => (
                          <TableFrame>
                            <table {...props} />
                          </TableFrame>
                        ),
                        p: ({ node: _node, ...props }) => <span {...props} />,
                      }}
                      remarkPlugins={[remarkGfm]}
                    >
                      {term.description}
                    </ReactMarkdown>
                  </GlossaryTermItem>
                ))}
              </GlossaryTermList>
            </GlossarySection>
          ))}
        </RuleContent>
      )}
    </PageContainer>
  );
};

function mapStateToProps(state: {
  rules: { currentRule: RulesGlossaryRule | null; currentRuleLoading: boolean };
}) {
  return {
    rule: state.rules.currentRule,
    loading: state.rules.currentRuleLoading,
  };
}

function mapDispatchToProps(dispatch: (action: unknown) => void) {
  return {
    getRule: (ruleSlug: string) => {
      dispatch(rest.actions.getRule({ id: ruleSlug }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RulesGlossary);
